const calculatorButtons = document.querySelectorAll(".calculator__button");
const calculatorInput = document.querySelector(".calculator__input");
const calculatorOutput = document.querySelector(".calculator__output");

let prevValue = "";
let hasValue = false;

var newValue = "";

const MAX_NUMBER_DIGITS = 7;

const CALCULATOR_TYPES = Object.freeze({
  OPERATION: "operation",
  NUMBER: "number",
  ACTION: "action",
});

class Car {
  constructor(name) {
    this._name = name;
  }
}

const car = new Car("new");
console.log(car);

const CALCULATOR_ACTIONS = {
  0: { type: CALCULATOR_TYPES.NUMBER, value: "0" },
  1: { type: CALCULATOR_TYPES.NUMBER, value: "1" },
  2: { type: CALCULATOR_TYPES.NUMBER, value: "2" },
  3: { type: CALCULATOR_TYPES.NUMBER, value: "3" },
  4: { type: CALCULATOR_TYPES.NUMBER, value: "4" },
  5: { type: CALCULATOR_TYPES.NUMBER, value: "5" },
  6: { type: CALCULATOR_TYPES.NUMBER, value: "6" },
  7: { type: CALCULATOR_TYPES.NUMBER, value: "7" },
  8: { type: CALCULATOR_TYPES.NUMBER, value: "8" },
  9: { type: CALCULATOR_TYPES.NUMBER, value: "9" },
  "+": { type: CALCULATOR_TYPES.OPERATION, value: "+" },
  "-": { type: CALCULATOR_TYPES.OPERATION, value: "-" },
};

const calculatorOperations = ["+", "-", "/", "*", "=", "remove"];
const calculatorKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const convertLocaleStringToNumber = function (localeString) {
  return Number(localeString.replace(/[^0-9-.]/g, ""));
};

const isCountDigitsMax = function (number) {
  return number.toString().length >= MAX_NUMBER_DIGITS;
};

const isCalculatorOperation = function (value) {
  return calculatorOperations.includes(value);
};

const onNumberInput = function (number) {
  if (!isCountDigitsMax(convertLocaleStringToNumber(calculatorInput.textContent))) {
    if (isCalculatorOperation(prevValue)) {
      calculatorInput.textContent = "";
    }

    calculatorInput.textContent = Number(
      convertLocaleStringToNumber(calculatorInput.textContent) + number,
    ).toLocaleString();

    hasValue = true;
  }
};

const onOperationInput = function (operation) {
  console.log(hasValue);

  if (hasValue) {
    const calcResult = eval(
      (calculatorOutput.textContent + convertLocaleStringToNumber(calculatorInput.textContent)).replaceAll(" ", ""),
    );

    calculatorInput.textContent = calcResult.toLocaleString();
  }

  calculatorOutput.textContent = convertLocaleStringToNumber(calculatorInput.textContent) + ` ${operation}`;

  hasValue = false;
};

document.addEventListener("keydown", (event) => {
  if (!isCalculatorOperation(event.key)) {
    onNumberInput(event.key);
  } else {
    onOperationInput(event.key);
  }
});

const onButtonClick = function (value) {
  return function (event) {
    console.log(event);
    if (isCalculatorOperation(value)) {
      onOperationInput(value);
    } else {
      onNumberInput(value);
    }

    prevValue = value;
  };
};

[...calculatorButtons].forEach((button) => {
  const buttonValue = button.getAttribute("data-js-calc-value");

  button.addEventListener("click", onButtonClick(buttonValue));
});
