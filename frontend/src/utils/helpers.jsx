// Parse time from ISO 8601 or numeric format
export const parseTime = (timeStr) => {
    if (!timeStr) return "N/A";

    // If it's a number, assume it's in minutes
    if (typeof timeStr === "number" || !isNaN(Number(timeStr))) {
        const totalMinutes = Number(timeStr);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    }

    // Handle ISO 8601 duration format (PT30M, PT1H30M)
    const match = String(timeStr).match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);

        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
    }

    return String(timeStr);
};

// Parse servings to extract number and unit
export const parseServings = (servingsStr) => {
    if (!servingsStr) return "N/A";

    const str = String(servingsStr).trim();

    // Extract number from string (handles "12 servings", "2 pies", "24 cookies", etc.)
    const match = str.match(/^(\d+)/);
    if (match) {
        const number = match[1];

        // Check if there's a unit after the number
        const unit = str.replace(/^\d+\s*/, "").trim();

        // Return formatted string
        if (unit) {
            return `${number} ${unit}`;
        }
        return `${number}`;
    }

    // If no number found, return as-is
    return str;
};
