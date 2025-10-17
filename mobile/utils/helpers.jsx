/**
 * Parse and format time strings
 * Handles: "30", "30 minutes", "1 hour", "1h 30m", "90 min", etc.
 */
export const parseTime = (timeStr) => {
    if (!timeStr) return "N/A";

    // If it's already a clean string like "30 min", return it
    if (typeof timeStr === "string") {
        const str = timeStr.trim().toLowerCase();

        // Try to extract numbers
        const hourMatch = str.match(/(\d+)\s*(?:hour|hr|h)/i);
        const minMatch = str.match(/(\d+)\s*(?:minute|min|m)(?!onth)/i);

        let totalMinutes = 0;

        if (hourMatch) {
            totalMinutes += parseInt(hourMatch[1]) * 60;
        }
        if (minMatch) {
            totalMinutes += parseInt(minMatch[1]);
        }

        // If we found time, format it
        if (totalMinutes > 0) {
            return formatMinutes(totalMinutes);
        }

        // If it's just a number string like "30" or "45"
        const numberMatch = str.match(/^\d+$/);
        if (numberMatch) {
            return formatMinutes(parseInt(numberMatch[0]));
        }

        // Return original if we can't parse it
        return timeStr;
    }

    // If it's a number, assume it's minutes
    if (typeof timeStr === "number") {
        return formatMinutes(timeStr);
    }

    return "N/A";
};

/**
 * Format minutes into human-readable string
 */
const formatMinutes = (minutes) => {
    if (!minutes || minutes === 0) return "N/A";

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr ${mins} min`;
};

/**
 * Parse servings
 */
export const parseServings = (servings) => {
    if (!servings) return "N/A";

    // If it's a number
    if (typeof servings === "number") {
        return `${servings}`;
    }

    // If it's a string like "4 servings" or "serves 4"
    if (typeof servings === "string") {
        const match = servings.match(/\d+/);
        if (match) {
            return match[0];
        }
        return servings;
    }

    return "N/A";
};

/**
 * Format instructions into steps
 */
export const formatInstructions = (instructions) => {
    if (!instructions) return [];

    // Split by common delimiters
    const steps = instructions
        .split(/\n\n|\n(?=\d+\.)|(?<=\.)\s+(?=\d+\.)/)
        .map((step) => step.trim())
        .filter((step) => step.length > 0);

    return steps;
};
