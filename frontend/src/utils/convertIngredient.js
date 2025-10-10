import { findConversion } from "./conversions-table";

const ingredientDensities = {
    flour: 140,
    "white whole wheat flour": 140,
    "plain flour": 140,

    "confectioners sugar": 120,
    "confectioners' sugar": 120,
    "confectioner's sugar": 120,
    "powdered sugar": 120,
    "icing sugar": 100,
    "caster sugar": 200,
    "granulated sugar": 200,
    "brown sugar": 180,
    "light brown sugar": 180,
    "soft light brown sugar": 180,
    "dark brown sugar": 180,
    "demerara sugar": 200,
    sugar: 200,

    "unsweetened cocoa powder": 100,
    "cocoa powder": 100,
    cocoa: 100,

    "dark chocolate chips": 180,
    "milk chocolate chips": 180,
    "chocolate chips": 180,
    chocolate: 180,

    "unsalted butter": 240,
    "salted butter": 240,
    butter: 240,

    "quick-cooking oats": 100,
    "rolled oats": 100,
    oats: 100,

    walnuts: 120,
    pecans: 110,
    raisins: 140,
};

const liquidDensities = {
    water: 250,
    milk: 260,
    applesauce: 255,
    honey: 350,
    oil: 230,
    "vanilla extract": 210,
    extract: 210,
};

function isDryIngredient(ingredientText) {
    const lowerText = ingredientText.toLowerCase();
    for (const ingredient of Object.keys(ingredientDensities)) {
        if (lowerText.includes(ingredient)) return true;
    }
    return false;
}

function getIngredientDensity(ingredientText) {
    const lowerText = ingredientText.toLowerCase();

    const cleanedText = lowerText.replace(/['''ʼ`]/g, "");

    let bestMatch = null;
    let bestMatchLength = 0;

    for (const [ingredient, density] of Object.entries(ingredientDensities)) {
        const cleanedIngredient = ingredient.replace(/['''’`]/g, "");

        if (cleanedText.includes(cleanedIngredient)) {
            console.log(
                `   ✓ Match: "${ingredient}" (${cleanedIngredient.length} chars) → ${density}g`
            );

            if (cleanedIngredient.length > bestMatchLength) {
                bestMatch = density;
                bestMatchLength = cleanedIngredient.length;
            }
        }
    }

    if (bestMatch) {
        return bestMatch;
    }

    for (const [ingredient, density] of Object.entries(liquidDensities)) {
        if (lowerText.includes(ingredient)) {
            return density;
        }
    }

    return 250;
}

function formatNumber(num) {
    if (num >= 1000) {
        return parseFloat((num / 1000).toFixed(2));
    } else if (num >= 100) {
        return Math.round(num);
    } else if (num >= 10) {
        return Math.round(num);
    } else if (num >= 1) {
        return parseFloat(num.toFixed(1));
    } else {
        return parseFloat(num.toFixed(1));
    }
}

function handleDualMeasurements(text, useMetric) {
    if (useMetric) {
        text = text.replace(/\/\s*\d+[¾½¼]?\s*(oz|lb|fl oz|floz)/gi, "");
    } else {
        const dualPattern =
            /(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\s*\/\s*(\d+[¾½¼]?)\s*(oz|lb|fl oz|floz)/gi;

        text = text.replace(
            dualPattern,
            (match, metricNum, metricUnit, imperialNum, imperialUnit) => {
                const cleanImperial = imperialNum
                    .replace("¾", ".75")
                    .replace("½", ".5")
                    .replace("¼", ".25");
                return `${cleanImperial} ${imperialUnit}`;
            }
        );
    }

    return text;
}

function handleStandaloneMetric(text, useMetric) {
    if (useMetric) return text;

    text = text.replace(/(\d+(?:\.\d+)?)\s*g\b/gi, (match, num) => {
        const grams = parseFloat(num);
        const oz = grams / 28.35;
        return oz >= 1 ? `${formatNumber(oz)} oz` : match;
    });

    text = text.replace(/(\d+(?:\.\d+)?)\s*kg\b/gi, (match, num) => {
        const kg = parseFloat(num);
        return `${formatNumber(kg * 2.205)} lb`;
    });

    text = text.replace(/(\d+(?:\.\d+)?)\s*ml\b/gi, (match, num) => {
        const ml = parseFloat(num);
        const floz = ml / 28.413;
        return floz >= 1 ? `${formatNumber(floz)} fl oz` : match;
    });

    return text;
}

function handleCompoundImperial(text, useMetric) {
    const compoundPattern = /(\d+)\s*lb\s+(\d+)\s*oz/gi;

    return text.replace(compoundPattern, (match, lbs, ozs) => {
        const totalOz = parseInt(lbs) * 16 + parseInt(ozs);

        if (useMetric) {
            const grams = totalOz * 28.35;
            const formatted = formatNumber(grams);
            return grams >= 1000 ? `${formatted} kg` : `${formatted} g`;
        }
        return `${totalOz} oz`;
    });
}

export const convertIngredient = (ingredient, useMetric) => {
    let converted = ingredient;

    converted = handleDualMeasurements(converted, useMetric);
    converted = handleCompoundImperial(converted, useMetric);
    converted = handleStandaloneMetric(converted, useMetric);
    converted = converted.replace(/\s*\([^)]*\)/g, "");

    converted = converted.replace(
        /(\d+)\s*°?\s*F(?:ahrenheit)?/gi,
        (match, temp) => {
            const celsius = Math.round(((parseInt(temp) - 32) * 5) / 9);
            return `${celsius}°C`;
        }
    );

    if (!useMetric) {
        return converted.trim();
    }

    // Convert measurements, but SKIP teaspoons and tablespoons
    const measurementPattern = new RegExp(
        // Pattern 1: "1 1/4 cups" or "1 and 1/4 cups"
        "(\\d+)\\s+(?:and\\s+)?(\\d+)\\s*\\/\\s*(\\d+)\\s+(cup|cups|ounce|ounces|oz|pound|pounds|lb|lbs)\\b" +
            "|" +
            // Pattern 2: "1/4 cup"
            "(\\d+)\\s*\\/\\s*(\\d+)\\s+(cup|cups|ounce|ounces|oz|pound|pounds|lb|lbs)\\b" +
            "|" +
            // Pattern 3: "2 cups" or "1.5 cups"
            "(\\d+(?:\\.\\d+)?)\\s+(cup|cups|ounce|ounces|oz|pound|pounds|lb|lbs)\\b",
        "gi"
    );

    converted = converted.replace(measurementPattern, (match, ...groups) => {
        let amount, unit;

        if (groups[0] !== undefined) {
            // Pattern 1: "1 1/4 cups"
            const whole = parseInt(groups[0]);
            const numerator = parseInt(groups[1]);
            const denominator = parseInt(groups[2]);
            amount = whole + numerator / denominator;
            unit = groups[3];
        } else if (groups[4] !== undefined) {
            // Pattern 2: "1/4 cup"
            const numerator = parseInt(groups[4]);
            const denominator = parseInt(groups[5]);
            amount = numerator / denominator;
            unit = groups[6];
        } else if (groups[7] !== undefined) {
            // Pattern 3: "2 cups"
            amount = parseFloat(groups[7]);
            unit = groups[8];
        } else {
            return match;
        }

        const conversion = findConversion(unit);
        if (!conversion) return match;

        const isDry = isDryIngredient(ingredient);

        if (conversion.type === "volume") {
            if (isDry) {
                const density = getIngredientDensity(ingredient);
                const grams = amount * density;
                const formatted = formatNumber(grams);
                return grams >= 1000 ? `${formatted} kg` : `${formatted} g`;
            } else {
                const ml = amount * conversion.ratio;
                const formatted = formatNumber(ml);
                return ml >= 1000 ? `${formatted} l` : `${formatted} ml`;
            }
        } else if (conversion.type === "weight") {
            const grams = amount * conversion.ratio;
            const formatted = formatNumber(grams);
            return grams >= 1000 ? `${formatted} kg` : `${formatted} g`;
        }

        return match;
    });

    return converted.trim();
};
