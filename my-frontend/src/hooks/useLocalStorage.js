import { useState, useEffect } from 'react';

// Custom hook for managing state persistence with localStorage
const useLocalStorage = (key, initialValue) => {
    // Initialize state with the value retrieved from localStorage or the provided initialValue
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key); // Retrieve value associated with the provided key from localStorage
        return storedValue ? JSON.parse(storedValue) : initialValue; // Parse stored value as JSON or use initialValue if no value found
    });

    // Update localStorage whenever the value changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value)); // Serialize value to JSON and store it in localStorage
    }, [key, value]); // Re-run effect whenever key or value changes

    // Return the current state value and a function to update it
    return [value, setValue];
};

export default useLocalStorage; // Export the custom hook for use in other components
