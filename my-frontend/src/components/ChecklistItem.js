import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ChecklistItem = ({ item, onToggle, onEditName, onDeleteItem, onAddNewItem, onAddNewSubItem, itemCount }) => {
    // Destructure item object to get id, name, and is_checked properties
    const { id, name, is_checked } = item;

    // State to manage editing mode and edited name
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Event handler for toggling checkbox
    const handleToggleClick = () => {
        onToggle(id);
    };

    // Event handler for clicking on item name to edit
    const handleNameClick = () => {
        setIsEditing(true);
    };

    // Event handler for changing the edited name
    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    // Event handler for blurring the input field (when it loses focus)
    const handleNameBlur = (e) => {
        // Check if the related target of the blur event is the "+" button
        if (e.relatedTarget && e.relatedTarget.classList.contains('add-sub-item-button')) {
            // If the related target is the "+" button, prevent the default behavior of the blur event
            e.preventDefault();
        } else {
            // If the related target is not the "+" button, proceed with handling the blur event
            setTimeout(() => {
                const updatedName = editedName.trim();
                if (updatedName !== name) {
                    onEditName(id, updatedName);
                }
                setIsEditing(false);
            }, 200);
        }
    };

    const handleNewSubItem = async () => {
        const updatedName = editedName.trim();
        if (updatedName !== name) {
            console.log('updatedName', updatedName);
            await onEditName(id, updatedName);
        }
        await onAddNewSubItem(item);
        setIsEditing(false);
    };

    // Event handler for key press events
    const handleKeyPress = (e) => {
        // Check if Enter key is pressed
        if (e.key === 'Enter') {
            // Call onAddNewItem to add a new item temporarily
            onAddNewItem(item);
            // Check if Backspace key is pressed and the editedName is empty
        } else if (e.key === 'Backspace' && !editedName) {
            // Check if this is the last item and has no parent (top-level item)
            if (itemCount === 1 && item.parent_item_id === null) {
                // Alert user that an empty checklist is not allowed
                alert("You can't have an empty checklist. Please ensure you have at least one item.");
            } else if (item.children.length) {
                // Confirm deletion of item and its sub-items
                if (window.confirm('Are you sure you want to delete this item and all its sub-items?')) {
                    onDeleteItem(id);
                }
            } else {
                // Delete item if it has no children
                onDeleteItem(id);
            }
        }
    };

    return (
        <li key={item.id}>
            {/* Icon for expanding/collapsing nested children */}
            {item.children && item.children.length > 0 && (
                // Icon to toggle expand/collapse state
                <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} onClick={handleToggleExpand} className="toggle-icon" />
            )}
            {/* Checkbox for marking item as checked/unchecked */}
            <label className="item-checkbox">
                {/* Checkbox input */}
                <input type="checkbox" checked={is_checked} onChange={handleToggleClick} />
            </label>
            {/* If currently editing item or not */}
            {isEditing ? (
                // Editing mode: input field and add sub-item button
                <>
                    {/* Input field for editing the name of the item */}
                    <input
                        type="text"
                        className={isEditing ? 'input-editing' : ''}
                        value={editedName}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        onKeyDown={handleKeyPress}
                        autoFocus
                    />
                    {/* Button to add a new sub-item */}
                    <button className="add-sub-item-button" onClick={() => handleNewSubItem(item)}>
                        +
                    </button>
                </>
            ) : (
                // Display mode: label for name
                <label id={item.id} className="item-name" onClick={handleNameClick}>
                    {/* Item name */}
                    {name} <span style={{ visibility: 'hidden' }}>Empty Click Area</span>
                </label>
            )}
            {/* Render children items if expanded */}
            {isExpanded && item.children && item.children.length > 0 && (
                <ul>
                    {/* Recursively render children */}
                    {item.children.map((child) => (
                        <ChecklistItem
                            key={child.id}
                            item={child}
                            onToggle={onToggle}
                            onEditName={onEditName}
                            onDeleteItem={onDeleteItem}
                            onAddNewItem={onAddNewItem}
                            onAddNewSubItem={onAddNewSubItem}
                            itemCount={itemCount}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default ChecklistItem;
