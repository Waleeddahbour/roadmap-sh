const LENGTH_UNITS = ["meter", "kilometer", "mile", "foot"];

const LENGTH_TO_METERS = {
  meter: 1,
  kilometer: 1000,
  mile: 1609.344,
  foot: 0.3048
};

function convertLength(value, fromUnit, toUnit) {
  const valueInMeters = value * LENGTH_TO_METERS[fromUnit];
  return valueInMeters / LENGTH_TO_METERS[toUnit];
}

export { LENGTH_UNITS, convertLength };