/**
 * UK/Imperial to Metric conversions for recipe measurements
 * UK cup = 250ml (NOT 236.588ml US cup)
 */

export const volumeConversions = {
    // UK Volume Measurements → Metric
    cup: { metric: "ml", ratio: 250, aliases: ["cups", "c"] }, // UK cup = 250ml
    tablespoon: {
        metric: "ml",
        ratio: 15, // UK tablespoon = 15ml
        aliases: [
            "tablespoons",
            "tbsp",
            "tbs",
            "T",
            "Tablespoon",
            "Tablespoons",
        ],
    },
    teaspoon: {
        metric: "ml",
        ratio: 5, // UK teaspoon = 5ml
        aliases: ["teaspoons", "tsp", "t"],
    },
    "fluid ounce": {
        metric: "ml",
        ratio: 28.413, // UK fl oz
        aliases: ["fluid ounces", "fl oz", "fl. oz.", "floz"],
    },
    pint: {
        metric: "ml",
        ratio: 568, // UK pint
        aliases: ["pints", "pt"],
    },
    quart: {
        metric: "ml",
        ratio: 1136, // UK quart
        aliases: ["quarts", "qt"],
    },
    gallon: {
        metric: "l",
        ratio: 4.546, // UK gallon
        aliases: ["gallons", "gal"],
    },
};

export const weightConversions = {
    ounce: { metric: "g", ratio: 28.35, aliases: ["ounces", "oz", "oz."] },
    pound: {
        metric: "g",
        ratio: 453.592,
        aliases: ["pounds", "lb", "lbs", "lb.", "lbs."],
    },
};

export const temperatureConversions = {
    fahrenheit: {
        metric: "°C",
        formula: (f) => Math.round(((f - 32) * 5) / 9),
        aliases: ["°f", "f", "degrees f", "F"],
    },
};

export const findConversion = (unit) => {
    const unitLower = unit.toLowerCase().trim();

    for (const [key, data] of Object.entries(volumeConversions)) {
        if (
            key === unitLower ||
            data.aliases?.map((a) => a.toLowerCase()).includes(unitLower)
        ) {
            return { ...data, type: "volume", originalUnit: key };
        }
    }

    for (const [key, data] of Object.entries(weightConversions)) {
        if (
            key === unitLower ||
            data.aliases?.map((a) => a.toLowerCase()).includes(unitLower)
        ) {
            return { ...data, type: "weight", originalUnit: key };
        }
    }

    for (const [key, data] of Object.entries(temperatureConversions)) {
        if (
            key === unitLower ||
            data.aliases?.map((a) => a.toLowerCase()).includes(unitLower)
        ) {
            return { ...data, type: "temperature", originalUnit: key };
        }
    }

    return null;
};

export default {
    volumeConversions,
    weightConversions,
    temperatureConversions,
    findConversion,
};
