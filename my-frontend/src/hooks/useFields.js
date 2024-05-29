import { useState } from 'react';

// Custom hook for handling form fields
const useFields = (initialState) => {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');

    // Handle change in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Handle special conditions for specific fields
        if (name === 'salary') {
            // Parse value to integer for salary field
            const intValue = parseInt(value, 10);
            if (!isNaN(intValue)) {
                newValue = intValue;
            } else {
                newValue = '';
            }
        } else if (name === 'equity') {
            // Validate and parse value to float for equity field
            const floatValue = parseFloat(value);
            if (isNaN(floatValue) || floatValue < 0 || floatValue >= 1) {
                newValue = '';
                setError('Equity must be greater than or equal to 0 but less than 1');
            } else {
                setError('');
            }
        }

        // Update form data with new value
        setFormData((formData) => ({
            ...formData,
            [name]: newValue,
        }));
    };

    // Reset form fields to initial state
    const resetForm = () => {
        setFormData(initialState);
        setError('');
    };

    return [formData, handleChange, resetForm, error];
};

export default useFields;
