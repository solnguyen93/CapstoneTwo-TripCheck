import { useState, useEffect } from 'react';

// Custom hook for data fetching
function useDataFetching(fetchFunction, ...args) {
    // Initialize state for fetched data and loading status
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Effect hook to fetch data when component mounts
    useEffect(() => {
        // Function to fetch data asynchronously
        async function fetchData() {
            try {
                // Call the fetch function with provided arguments
                const fetchedData = await fetchFunction(...args);
                // Update state with fetched data and mark loading as complete
                setData(fetchedData);
                setLoading(false);
            } catch (error) {
                // Log any errors that occur during data fetching
                console.error('Error fetching data:', error);
            }
        }

        // Call fetchData function when component mounts
        fetchData();
    }, []); // Empty dependency array ensures effect runs only once when component mounts

    // Return the fetched data, setData function for updating data, and loading status
    return { data, setData, loading };
}

export default useDataFetching;
