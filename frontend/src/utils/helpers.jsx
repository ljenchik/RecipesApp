// src/utils/helpers.js

export const parseTime = (timeStr) => {
    if (!timeStr) return "N/A";

    // Handle ISO 8601 duration format (PT30M, PT1H30M, PT2H)
    const match = timeStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);

        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
    }

    // If it's just a number (minutes), handle that too
    const numericTime = parseInt(timeStr);
    if (!isNaN(numericTime)) {
        const hours = Math.floor(numericTime / 60);
        const minutes = numericTime % 60;

        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
    }

    return timeStr; // Fallback to raw string
};
