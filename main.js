console.log("Calculator is running.");

// Calculator interface elements & functions

const expression = document.querySelector(".expression");

expression.addEventListener("keydown", (e) => {
  if (
    e.key.match(/[\d%\+\.()]|Backspace|Delete/) ||
    [37, 38, 39, 40].includes(e.keyCode) // arrow keys
  ) {
    return;
  } else if (e.key === "*") {
    e.preventDefault();
    useMathSymbol("×");
  } else if (e.key === "/") {
    e.preventDefault();
    useMathSymbol("÷");
  } else if (e.key === "-") {
    e.preventDefault();
    useMathSymbol("−");
  } else {
    e.preventDefault();
  }
});

const result = document.querySelector(".result");

function clearCalculator() {
  expression.value = "";
  result.innerText = "";
}

const keys = document.querySelectorAll("[data-key]");
keys.forEach((key) => {
  let value = key.dataset.key;
  if (value === "clear") {
    key.addEventListener("click", clearCalculator);
  }
  if (value.match(/[\d%×÷\+\−\.]/)) {
    key.addEventListener("click", () => inputValue(value));
  }
});

// Calculator logic & functions

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 === 0) {
    return "Infinity";
  }
  return num1 / num2;
}

function operate(operator, num1, num2) {
  switch (operator) {
    case "×":
      return multiply(num1, num2);
    case "÷":
      return divide(num1, num2);
    case "+":
      return add(num1, num2);
    case "−":
      return subtract(num1, num2);
  }
}

// Helper functions

function useMathSymbol(symbol) {
  expression.setRangeText(
    symbol,
    expression.selectionStart,
    expression.selectionEnd,
    "end"
  );
}

function inputValue(value) {
  expression.focus();
  expression.setRangeText(
    value,
    expression.selectionStart,
    expression.selectionEnd,
    "end"
  );
}
