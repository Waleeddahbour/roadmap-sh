const TEMPERATURE_UNITS = ["celsius", "fahrenheit", "kelvin"];

function convertTemperature(value, fromUnit, toUnit) {
	let valueInCelsius = value;

	if (fromUnit === "fahrenheit") {
		valueInCelsius = (value - 32) * (5 / 9);
	} else if (fromUnit === "kelvin") {
		valueInCelsius = value - 273.15;
	}

	if (toUnit === "fahrenheit") {
		return (valueInCelsius * 9) / 5 + 32;
	}

	if (toUnit === "kelvin") {
		return valueInCelsius + 273.15;
	}

	return valueInCelsius;
}

export { TEMPERATURE_UNITS, convertTemperature };
