import React, { useState } from 'react';

const ChecklistItem = ({ item, onToggle, onEditName, onDeleteItem, onAddNewItem, onAddNewSubItem, itemCount }) => {
    // Destructure item object to get id, name, and is_checked properties
    const { id, name, is_checked } = item;

    // State to manage editing mode and edited name
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);

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
    const handleNameBlur = () => {
        // Delay handling the blur event to ensure the button click function executes first
        setTimeout(() => {
            setIsEditing(false);
            const updatedName = editedName.trim();
            if (updatedName !== name) {
                onEditName(id, updatedName);
            }
        }, 200);
    };

    // Event handler for key press events
    const handleKeyPress = (e) => {
        // Check if Tab key is pressed
        if (e.key === 'Tab') {
            // Call onAddNewSubItem to add a new sub item temporarily
            onAddNewSubItem(item);
            // Check if Enter key is pressed
        } else if (e.key === 'Enter') {
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
            {/* Checkbox for marking item as checked/unchecked */}
            <label className="item-checkbox">
                <input type="checkbox" checked={is_checked} onChange={handleToggleClick} />
            </label>
            {/* If currently editing item or not */}
            {isEditing ? (
                <div>
                    {/* Input field for editing the name of the item */}
                    <input type="text" value={editedName} onChange={handleNameChange} onBlur={handleNameBlur} onKeyDown={handleKeyPress} autoFocus />
                    {/* Button to add a new sub-item */}
                    <button onClick={() => onAddNewSubItem(item)}>Add Sub Item</button>
                </div>
            ) : (
                // Label for displaying name and enabling editing on click
                <label id={item.id} className="item-name" onClick={handleNameClick}>
                    {name} <span style={{ visibility: 'hidden' }}>Empty Click Area</span>
                </label>
            )}
            {/* Render children items recursively if they exist */}
            {item.children && item.children.length > 0 && (
                <ul>
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
