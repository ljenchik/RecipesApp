/**
 * UK/Imperial to Metric conversions for recipe measurements
 * UK cup = 250ml (NOT 236.588ml US cup)
 */

export const volumeConversions = {
    // UK Volume Measurements → Metric
    cup: { metric: "ml", ratio: 250, aliases: ["cups", "c", "Cup", "Cups"] },
    tablespoon: {
        metric: "ml",
        ratio: 15,
        aliases: [
            "tablespoon",
            "tablespoons",
            "Tablespoon",
            "Tablespoons",
            "tbsp",
            "Tbsp",
            "TBSP",
            "tbs",
            "Tbs",
            "T",
        ],
    },
    teaspoon: {
        metric: "ml",
        ratio: 5,
        aliases: [
            "teaspoon",
            "teaspoons",
            "Teaspoon",
            "Teaspoons",
            "tsp",
            "Tsp",
            "TSP",
            "t",
        ],
    },
    "fluid ounce": {
        metric: "ml",
        ratio: 28.413,
        aliases: [
            "fluid ounce",
            "fluid ounces",
            "Fluid Ounce",
            "Fluid Ounces",
            "fl oz",
            "Fl Oz",
            "fl. oz.",
            "floz",
        ],
    },
    pint: {
        metric: "ml",
        ratio: 568,
        aliases: ["pint", "pints", "Pint", "Pints", "pt", "Pt"],
    },
    quart: {
        metric: "ml",
        ratio: 1136,
        aliases: ["quart", "quarts", "Quart", "Quarts", "qt", "Qt"],
    },
    gallon: {
        metric: "l",
        ratio: 4.546,
        aliases: ["gallon", "gallons", "Gallon", "Gallons", "gal", "Gal"],
    },
};

export const weightConversions = {
    ounce: {
        metric: "g",
        ratio: 28.35,
        aliases: ["ounce", "ounces", "Ounce", "Ounces", "oz", "Oz", "oz."],
    },
    pound: {
        metric: "g",
        ratio: 453.592,
        aliases: [
            "pound",
            "pounds",
            "Pound",
            "Pounds",
            "lb",
            "Lb",
            "lbs",
            "Lbs",
            "lb.",
            "lbs.",
        ],
    },
};

export const temperatureConversions = {
    fahrenheit: {
        metric: "°C",
        formula: (f) => Math.round(((f - 32) * 5) / 9),
        aliases: [
            "fahrenheit",
            "Fahrenheit",
            "°f",
            "°F",
            "f",
            "F",
            "degrees f",
        ],
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
