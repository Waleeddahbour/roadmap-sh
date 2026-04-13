import { LENGTH_UNITS, convertLength } from "./length.js";
import { WEIGHT_UNITS, convertWeight } from "./weight.js";
import { TEMPERATURE_UNITS, convertTemperature } from "./temperature.js";

const tabs = document.querySelectorAll(".js-tab");
const content = document.querySelector("#converter-content");

const unitsByType = {
  length: LENGTH_UNITS,
  weight: WEIGHT_UNITS,
  temperature: TEMPERATURE_UNITS
};

function getUnitOptions(type) {
  return unitsByType[type]
    .map((unit) => `<option value="${unit}">${unit}</option>`)
    .join("");
}

function generateHTML(type) {
  const options = getUnitOptions(type);
  const title = `${type[0].toUpperCase() + type.slice(1)} Converter`;

  return `
  <form class="converter-form" data-type="${type}">
    <h2>${title}</h2>
    <label class="field-label" for="input-value">Enter value</label>
    <input class="field-input" id="input-value" type="number" step="any" placeholder="Enter ${type} value" required>

    <label class="field-label" for="from-unit">Unit to convert from</label>
    <select class="field-input" id="from-unit">
      ${options}
    </select>

    <label class="field-label" for="to-unit">Unit to convert to</label>
    <select class="field-input" id="to-unit">
      ${options}
    </select>

    <button class="convert-btn" type="submit">Convert</button>
    <p class="result-text js-result"></p>
  </form>
  `;
}

function convertValue(type, value, fromUnit, toUnit) {
  if (type === "length") {
    return convertLength(value, fromUnit, toUnit);
  } else if (type === "weight") {
    return convertWeight(value, fromUnit, toUnit);
  } else {
    return convertTemperature(value, fromUnit, toUnit);
  } 
}

function bindFormHandler() {
  const form = content.querySelector(".converter-form");
  const valueInput = content.querySelector("#input-value");
  const fromSelect = content.querySelector("#from-unit");
  const toSelect = content.querySelector("#to-unit");
  const resultText = content.querySelector(".js-result");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = Number(valueInput.value);
    if (!Number.isFinite(value)) {
      resultText.textContent = "Please enter a valid number.";
      return;
    }

    const type = form.dataset.type;
    const convertedValue = convertValue(type, value, fromSelect.value, toSelect.value);
    resultText.textContent = `${value} ${fromSelect.value} = ${convertedValue.toFixed(4)} ${toSelect.value}`;
  });
}

function render(type) {
  content.innerHTML = generateHTML(type);
  bindFormHandler();

  tabs.forEach((tab) =>
    tab.classList.toggle("is-active", tab.dataset.type === type)
  );
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => render(tab.dataset.type));
});

render("length"); // default