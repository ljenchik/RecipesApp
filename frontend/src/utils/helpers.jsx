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

export const formatInstructions = (text) => {
    if (!text) return [];

    // 1. Normalize whitespace
    let cleaned = text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+/g, " ")
        .trim();

    // 2. If already split by double newlines, use that
    const preformatted = cleaned
        .split("\n\n")
        .filter((s) => s.trim().length > 0);
    if (preformatted.length > 1) {
        return preformatted;
    }

    // 3. Single giant paragraph - need to intelligently split
    const steps = [];
    let current = "";
    let parenDepth = 0;

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        const next1 = cleaned[i + 1];
        const next2 = cleaned[i + 2];

        current += char;

        // Track parentheses
        if (char === "(") parenDepth++;
        if (char === ")") parenDepth--;

        // Detect sentence end outside parentheses
        const isSentenceEnd =
            (char === "." || char === "!" || char === "?") && parenDepth === 0;

        if (isSentenceEnd && next1 === " " && next2 && /[A-Z]/.test(next2)) {
            // We have ". Capital" pattern
            const trimmed = current.trim();

            // Split criteria:
            // 1. Current text is getting long (>100 chars)
            // 2. OR we've accumulated 2+ sentences
            // 3. OR next sentence starts with action verb

            const sentenceCount = (trimmed.match(/[.!?]/g) || []).length;
            const isLongEnough = trimmed.length > 100;
            const hasMultipleSentences = sentenceCount >= 2;

            // Common recipe action verbs that indicate new step
            const actionVerbs =
                /^(Add|Stir|Mix|Pour|Place|Remove|Set|Cook|Bake|Heat|Combine|Whisk|Beat|Fold|Season|Serve|Transfer|Sprinkle|Garnish|Cover|Refrigerate|Preheat|Grease|Line|Divide|Arrange|Brush|Drizzle|Top|Layer)/;
            const nextSentenceStart = cleaned.substring(i + 2, i + 50);
            const startsWithAction = actionVerbs.test(nextSentenceStart);

            if (
                (isLongEnough && hasMultipleSentences) ||
                (isLongEnough && startsWithAction)
            ) {
                steps.push(trimmed);
                current = "";
                i++; // Skip the space after period
            }
        }
    }

    // Add remaining text
    const remaining = current.trim();
    if (remaining.length > 0) {
        steps.push(remaining);
    }

    // 4. Detect and extract headers (text ending with colon)
    const finalSteps = [];

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        // Check if step contains an embedded header
        // Pattern: "Header: Rest of text..."
        const headerMatch = step.match(/^([^:]{10,80}):\s+(.+)$/s);

        if (headerMatch) {
            // Split header from instruction
            finalSteps.push(
                `${headerMatch[1].trim()}:\n${headerMatch[2].trim()}`
            );
        } else {
            finalSteps.push(step);
        }
    }

    // 5. Filter out very short fragments
    return finalSteps.filter((s) => s.trim().length > 15);
};
