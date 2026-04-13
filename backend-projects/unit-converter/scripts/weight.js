const WEIGHT_UNITS = ["gram", "kilogram", "pound", "ounce"];

const WEIGHT_TO_GRAMS = {
	gram: 1,
	kilogram: 1000,
	pound: 453.59237,
	ounce: 28.349523125
};

function convertWeight(value, fromUnit, toUnit) {
	const valueInGrams = value * WEIGHT_TO_GRAMS[fromUnit];
	return valueInGrams / WEIGHT_TO_GRAMS[toUnit];
}

export { WEIGHT_UNITS, convertWeight };
