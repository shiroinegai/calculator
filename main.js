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
    inputValue("×");
  } else if (e.key === "/") {
    e.preventDefault();
    inputValue("÷");
  } else if (e.key === "-") {
    e.preventDefault();
    inputValue("−");
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
  if (value === "parenthesis") {
    key.addEventListener("click", () => handleParenthesisInput());
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

function handleParenthesisInput() {
  if (
    expression.value.slice(locateLastOpenParen() + 1).length > 0 &&
    noOfCloseParen() < noOfOpenParen()
  ) {
    inputValue(")");
  } else {
    inputValue("(");
  }
}

function locateLastOpenParen() {
  return expression.value.lastIndexOf("(");
}

function locateNextCloseParen(position) {
  return expression.value.indexOf(")", position);
}

function noOfOpenParen() {
  if (expression.value.match(/\(/g)) {
    return expression.value.match(/\(/g).length;
  } else {
    return 0;
  }
}

function noOfCloseParen() {
  if (expression.value.match(/\)/g)) {
    return expression.value.match(/\)/g).length;
  } else {
    return 0;
  }
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
