import { format, parseISO } from 'date-fns';

// Helper function to format date strings to 'mm/dd/yyyy'
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Return 'N/A' if dateString is falsy

    const parsedDate = parseISO(dateString); // Parse the ISO 8601 date string
    return format(parsedDate, 'yyyy-MM-dd'); // Format the parsed date to 'mm/dd/yyyy'
};

// Helper function to format date range
const formatDateRange = (startDateString, endDateString) => {
    if (!startDateString && !endDateString) {
        return null; // Return null if both start and end dates are null
    } else if (startDateString === endDateString) {
        return formatDate(startDateString); // Return only "from" date if start and end dates are the same
    } else {
        return `${formatDate(startDateString)} to ${formatDate(endDateString)}`; // Return date range if start and end dates are different
    }
};

export { formatDate, formatDateRange };
