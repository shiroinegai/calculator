console.log("Calculator is running.");

// Calculator interface elements & functions

const expression = document.querySelector(".expression");

expression.addEventListener("keydown", (e) => {
  if (
    e.key.match(/[\d\+()]|Backspace|Delete/) ||
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
  } else if (e.key === ".") {
    e.preventDefault();
    handleDecimalInput();
  } else if (e.key === "%") {
    e.preventDefault();
    handlePercentInput();
  } else if (e.key === "=" || e.key === "Enter") {
    e.preventDefault();
    equal();
  } else {
    e.preventDefault();
  }
});

expression.addEventListener("keyup", updateResult);

const result = document.querySelector(".result");

function updateResult() {
  let preview;
  if (expression.value && expression.value.slice(-1).match(/[\d%)]/)) {
    preview = solveExpression(expression.value);

    if (preview === NaN) {
      result.innerText = "Please check syntax";
    } else {
      result.innerText =
        preview.toString().length <= 20 ? preview : "I can't handle this!";
    }
  }
}

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
  if (value === ".") {
    key.addEventListener("click", () => handleDecimalInput());
  }
  if (value === "%") {
    key.addEventListener("click", () => handlePercentInput());
  }
  if (value.match(/[\d×÷\+\−]/)) {
    key.addEventListener("click", () => inputValue(value));
  }
  if (value === "equal") {
    key.addEventListener("click", () => equal());
  }
  if (value === "backspace") {
    key.addEventListener("click", () => {
      expression.focus();
      expression.setRangeText(
        "",
        expression.selectionStart - 1,
        expression.selectionEnd,
        "end"
      );
      updateResult();
    });
  }
});

function equal() {
  if (
    !isNaN(parseFloat(result.innerText)) &&
    isFinite(parseFloat(result.innerText))
  ) {
    expression.value = result.innerText;
    result.innerText = "";
  }
}

// Calculator logic & functions

function add(num1, num2) {
  if (isNaN(num2) && num2.includes("%")) {
    return num1 * (1 + parsePercent(num2) / 100);
  } else {
    return num1 + num2;
  }
}

function subtract(num1, num2) {
  if (isNaN(num2) && num2.includes("%")) {
    return num1 * (1 - parsePercent(num2) / 100);
  } else {
    return num1 - num2;
  }
}

function multiply(num1, num2) {
  if (isNaN(num2) && num2.includes("%")) {
    return num1 * (parsePercent(num2) / 100);
  } else {
    return num1 * num2;
  }
}

function divide(num1, num2) {
  if (num2 === 0) {
    return "Infinity";
  } else if (isNaN(num2) && num2.includes("%")) {
    return num1 / (parsePercent(num2) / 100);
  } else {
    return num1 / num2;
  }
}

function operate(num1, operator, num2) {
  num1 = parseFloat(num1);
  if (isNaN(num2) && num2.includes("%")) {
    console.log(num2);
  } else {
    num2 = parseFloat(num2);
  }
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

function solveExpression(inputExp) {
  let evalParen = inputExp;

  if (evalParen.includes(")(")) {
    evalParen = evalParen.replaceAll(")(", ")×(");
  }

  while (
    evalParen.includes("(") &&
    evalParen.includes(")") &&
    noOfOpenParen() === noOfCloseParen()
  ) {
    let openParenIndex = locateLastOpenParen(evalParen);
    let closeParenIndex = locateNextCloseParen(evalParen, openParenIndex);

    let workingParenExp = evalParen.slice(openParenIndex + 1, closeParenIndex);

    parenSolution = solveExpression(workingParenExp);

    evalParen = evalParen.replace(`(${workingParenExp})`, parenSolution);
  }

  let workingExp = parseExpression(evalParen);

  while (workingExp.includes("×") || workingExp.includes("÷")) {
    let i = workingExp.findIndex((e) => {
      return e === "×" || e === "÷";
    });

    let segment = operate(workingExp[i - 1], workingExp[i], workingExp[i + 1]);

    workingExp.splice(i - 1, 3, segment);
  }

  while (workingExp.includes("+") || workingExp.includes("−")) {
    let i = workingExp.findIndex((e) => {
      return e === "+" || e === "−";
    });

    let segment = operate(workingExp[i - 1], workingExp[i], workingExp[i + 1]);

    workingExp.splice(i - 1, 3, segment);
  }

  solution = parseFloat(workingExp[0]);

  if (Number.isInteger(solution)) {
    return solution;
  } else {
    return handleFloat(solution);
  }
}

// Helper functions

function parseExpression(inputExp) {
  return inputExp.split(/([×÷+−])/);
}

function parsePercent(percent) {
  return parseFloat(percent.slice(0, -1));
}

function handleFloat(num) {
  rounded = parseFloat(num).toFixed(3);
  return rounded;
}

function handlePercentInput() {
  inputValue("%");

  let percentTest = expression.value.split(/[×÷+−]/);

  for (let i = 0; i < percentTest.length; i++) {
    if (
      percentTest[i].match(/\d+(\.?\d*)%{2,}/) ||
      percentTest[i].match(/%\d+(\.?\d*)/) ||
      percentTest[i].match(/\d+(%{2,}\.?\d*)/) ||
      percentTest[i] === "%"
    ) {
      expression.setRangeText(
        "",
        expression.selectionStart - 1,
        expression.selectionEnd,
        "end"
      );
      updateResult();
    }
  }
}

function handleDecimalInput() {
  inputValue(".");

  let decimalTest = expression.value.split(/[×÷+−]/);

  for (let i = 0; i < decimalTest.length; i++) {
    if (
      decimalTest[i].match(/\d+(\.{2,}\d*)/) ||
      decimalTest[i].match(/\.\d+(\.\d*)/) ||
      decimalTest[i].match(/\d+(\.\d*\.)/) ||
      decimalTest[i].match(/\.{2,}%/) ||
      decimalTest[i].match(/%\.+/) ||
      decimalTest[i] === "."
    ) {
      expression.setRangeText(
        "",
        expression.selectionStart - 1,
        expression.selectionEnd,
        "end"
      );
      updateResult();
    }
  }
}

function handleParenthesisInput() {
  if (
    expression.value.slice(locateLastOpenParen(expression.value) + 1).length >
      0 &&
    noOfCloseParen() < noOfOpenParen()
  ) {
    inputValue(")");
  } else {
    inputValue("(");
  }
}

function locateLastOpenParen(inputExp) {
  return inputExp.lastIndexOf("(");
}

function locateNextCloseParen(inputExp, position) {
  return inputExp.indexOf(")", position);
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
  updateResult();
}
