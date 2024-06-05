import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import TripCheckApi from '../api.js';
import useDataFetching from '../hooks/useDataFetching';
import ChecklistItem from './ChecklistItem.js';
import { useAuth } from '../AuthContext';
import { Box, Typography } from '@mui/material';
import '../styles/ChecklistDetails.css';

const ChecklistDetails = () => {
    const [focusItem, setFocusItem] = useState(null);
    const { setChecklistId, msg } = useAuth();
    const { checklistId } = useParams();

    useEffect(() => {
        setChecklistId(checklistId);
    }, [checklistId]);

    // Fetch checklist data (details)
    const { data: checklist, loading: checklistLoading } = useDataFetching(() => {
        return TripCheckApi.getChecklistById(checklistId);
    });

    // Fetch checklist items data
    const {
        data: items,
        setData: setItems,
        loading: itemsLoading,
    } = useDataFetching(() => {
        return TripCheckApi.getItemsByChecklistId(checklistId);
    });

    // Continuously checks for the newly added item in the DOM and clicks on it to give it focus
    useEffect(() => {
        // Set up an interval to check for the presence of the element with the focusItem
        const intervalId = setInterval(() => {
            // Get the DOM element with the focusItem
            const newItemInput = document.getElementById(`${focusItem}`);
            // If the element exists
            if (newItemInput) {
                // Simulate a click on the element
                newItemInput.click();
                // Clear the interval after the click to prevent further clicks
                clearInterval(intervalId);
            }
        }, 200);
        // Cleanup function to clear the interval when the component unmounts or when `focusItem` changes
        return () => clearInterval(intervalId);
    }, [focusItem]);

    // If still loading, display a loading message
    if (checklistLoading || itemsLoading) {
        return <p>Loading...</p>;
    }

    // If no data is returned, display a message indicating no checklist found
    if (!checklist || !items) {
        return <p>No checklist found.</p>;
    }

    // Recursive function to toggle is_checked property for an item and its children
    const toggleItemRecursively = (items, itemId) => {
        return items.map((item) => {
            // If the current item matches the target itemId
            if (item.id === itemId) {
                // Toggle the is_checked property for the current item
                return { ...item, is_checked: !item.is_checked };
                // If current item has children
            } else if (item.children && item.children.length > 0) {
                // Recursively call the function on its children
                return { ...item, children: toggleItemRecursively(item.children, itemId) };
                // If it doesn't match and doesn't have children
            } else {
                // Return the item unchanged
                return item;
            }
        });
    };

    // Handle toggling of checklist item
    const handleToggle = (itemId) => {
        // Update the local state first to reflect the toggle of is_checked property
        setItems((prevItems) => toggleItemRecursively(prevItems, itemId));
        // Make an asynchronous API call to update the item's is_checked property in the database
        TripCheckApi.toggleItem(itemId, checklistId)
            .then(() => {
                console.log('Item checked status updated successfully in the database.');
            })
            .catch((error) => {
                console.error('Error updating item checked status in the database:', error);
            });
    };

    // Recursive function to update the name of an item and its children
    const updateItemNameRecursively = (items, itemId, newName) => {
        return items.map((item) => {
            // If the current item matches the target itemId
            if (item.id === itemId) {
                // Update the name of the current item
                return { ...item, name: newName };
                // If current item has children
            } else if (item.children && item.children.length > 0) {
                // Recursively call the function on its children
                return { ...item, children: updateItemNameRecursively(item.children, itemId, newName) };
                // If it doesn't match and doesn't have children
            } else {
                // Return the item unchanged
                return item;
            }
        });
    };

    // Handle editing the name of a checklist item
    const handleEditName = (itemId, newName) => {
        // Update the local state first to reflect the edit
        const updatedItems = updateItemNameRecursively(items, itemId, newName);
        setItems(updatedItems);
        // Make an asynchronous API call to update the item from the database
        TripCheckApi.updateItemName(itemId, newName, checklistId)
            .then(() => {
                console.log('Item name updated successfully in the database.');
            })
            .catch((error) => {
                console.error('Error updating item name in the database:', error);
            });
    };

    // Recursive function to delete an item and its children
    const deleteItemRecursively = (items, itemId) => {
        return items.reduce((acc, item) => {
            // If the current item matches the target itemId, skip it
            if (item.id === itemId) {
                return acc;
                // If current item has children
            } else if (item.children && item.children.length > 0) {
                // Recursively call the function on its children
                return [...acc, { ...item, children: deleteItemRecursively(item.children, itemId) }];
                // If it doesn't match and doesn't have children
            } else {
                // Return the item unchanged
                return [...acc, item];
            }
        }, []);
    };

    // Handle deleting a checklist item
    const handleDeleteItem = (itemId) => {
        // Update the local state first to reflect the deletion
        const updatedItems = deleteItemRecursively(items, itemId);
        setItems(updatedItems);
        // Make an asynchronous API call to delete the item from the database
        TripCheckApi.deleteItem(itemId, checklistId)
            .then(() => {
                console.log('Item deleted successfully from the database.');
            })
            .catch((error) => {
                console.error('Error deleting item from the database:', error);
            });
    };

    // Handle adding a new checklist item
    const handleAddNewItem = (currentItem) => {
        let newItemPosition = currentItem.position || 0;
        newItemPosition += 1;
        const newItem = {
            id: uuidv4(), // Generate a unique temporary ID for the new item
            name: '', // Placeholder name for the new item
            checklist_id: currentItem.checklist_id,
            parent_item_id: currentItem.parent_item_id === null ? null : currentItem.parent_item_id, // explicit check for null - In JavaScript, attempting to access a property or method on a null value can result in a TypeError, causing the program to crash. By explicitly checking if currentItem.parent_item_id is null and setting parent_item_id to null if it is, we ensure that we handle null values safely, preventing potential errors.
            is_checked: false,
            children: [],
            position: newItemPosition,
        };
        // Update the local state first to reflect the addition of the new sub-item
        setItems((prevItems) => {
            // Update the items state with the new sub-item added
            const updatedItems = addNewItemRecursively(prevItems, newItem, currentItem);
            return updatedItems;
        });

        // Make an API call to add the new item to the database
        TripCheckApi.addItem({ ...newItem, id: null }, checklistId)
            .then((res) => {
                setFocusItem(res.newItem.id);
                // Fetch the updated list of items from the database
                return TripCheckApi.getItemsByChecklistId(checklistId);
            })
            .then((updatedItems) => {
                // Update the items state with the updated list of items
                setItems(updatedItems);
                console.log('New item added successfully.');
            })
            .catch((error) => {
                console.error('Error adding new item:', error);
            });
    };

    const handleAddSubItem = (currentItem) => {
        const newItem = {
            id: uuidv4(),
            name: '',
            checklist_id: currentItem.checklist_id,
            parent_item_id: currentItem.id, // Set parent_item_id to the id of the current item
            is_checked: false,
            children: [],
            position: 0,
        };

        // Update the local state to reflect the addition of the new item
        const updatedItems = addNewItemRecursively(items, newItem, currentItem);
        setItems(updatedItems);
        // Make an API call to add the new item to the database
        TripCheckApi.addItem({ ...newItem, id: null }, checklistId)
            .then((res) => {
                setFocusItem(res.newItem.id);
                // Fetch the updated list of items from the database
                return TripCheckApi.getItemsByChecklistId(checklistId);
            })
            .then((fetchItems) => {
                // Update the items state with the updated list of items
                setItems(fetchItems);
                // Set the focus to the newly added item
                console.log('New sub item added successfully.');
            })
            .catch((error) => {
                console.error('Error adding new sub item:', error);
            });
    };

    // Recursive function to add a new item at the correct position within its parent
    const addNewItemRecursively = (items, newItem, currentItem) => {
        // If the current item is a top-level item (parent_id is null)
        if (currentItem.parent_item_id === null) {
            // Find the index of the current item
            const currentIndex = items.findIndex((item) => item.id === currentItem.id);
            // Insert the new item after the current item
            return [...items.slice(0, currentIndex + 1), newItem, ...items.slice(currentIndex + 1)];
        }

        return items.map((item) => {
            // If the current item matches the current item's parent (find currentItem's parent)
            if (item.id === currentItem.parent_item_id) {
                // Find the index of the current item among its siblings
                const index = item.children.findIndex((child) => child.id === currentItem.id);
                // Insert the new item after the current item
                return {
                    ...item,
                    children: [...item.children.slice(0, index + 1), newItem, ...item.children.slice(index + 1)],
                };
            }
            // If the item has children, recursively call the function on its children
            else if (item.children && item.children.length > 0) {
                return {
                    ...item,
                    children: addNewItemRecursively(item.children, newItem, currentItem),
                };
            }
            // For all other items, return them unchanged
            else {
                return { ...item };
            }
        });
    };

    // Helper function to handle date range
    const handleDateRange = (startDateString, endDateString) => {
        // If both start and end dates are null or empty, return null
        if (!startDateString && !endDateString) {
            return null;
        } else if (!endDateString) {
            // If end date is null or empty, return only start date
            return startDateString;
        } else if (!startDateString) {
            // If start date is null or empty, return only end date
            return endDateString;
        } else if (startDateString === endDateString) {
            // If start and end dates are the same, return only one date
            return startDateString;
        } else {
            // If both start and end dates are present and different, return date range
            return `${startDateString} to ${endDateString}`;
        }
    };

    // Render the ChecklistDetails component
    return (
        <Box className="checklist-details-container">
            {msg.message && (
                <Typography variant="body2" sx={{ mb: 2, color: msg.type === 'danger' ? 'error.main' : 'success.main' }}>
                    {msg.message}
                </Typography>
            )}
            {/* Display checklist details such as title, description, destination, and date */}
            <div className="checklist-details">
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {checklist.title}
                </Typography>
                {checklist.description && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Description:</strong> {checklist.description}
                    </Typography>
                )}
                {checklist.tripDestination && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Destination:</strong> {checklist.tripDestination}
                    </Typography>
                )}
                {handleDateRange(checklist.tripFromDate, checklist.tripToDate) && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Date:</strong> {handleDateRange(checklist.tripFromDate, checklist.tripToDate)}
                    </Typography>
                )}
            </div>
            {/* Render checklist items */}
            <div>
                <ul className="checklist-items-list">
                    {' '}
                    {/* Apply CSS class */}
                    {items.map((item) => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            onToggle={handleToggle}
                            onEditName={handleEditName}
                            onDeleteItem={handleDeleteItem}
                            onAddNewItem={handleAddNewItem}
                            onAddNewSubItem={handleAddSubItem}
                            itemCount={items.length}
                        />
                    ))}
                </ul>
            </div>
        </Box>
    );
};

export default ChecklistDetails;
