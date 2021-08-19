console.log("Calculator is running.");

add = (num1, num2) => {
  return num1 + num2;
};

subtract = (num1, num2) => {
  return num1 - num2;
};

multiply = (num1, num2) => {
  return num1 * num2;
};

divide = (num1, num2) => {
  if (num2 === 0) {
    return "Infinity";
  }
  return num1 / num2;
};

operate = (operator, num1, num2) => {
  switch (operator) {
    case "multiply":
      return multiply(num1, num2);
    case "divide":
      return divide(num1, num2);
    case "add":
      return add(num1, num2);
    case "subtract":
      return subtract(num1, num2);
  }
};

const expression = document.querySelector(".expression");
expression.addEventListener("keydown", (e) => {
  if (
    e.key.match(/[\d%\-\+\.()]|Backspace|Delete/) ||
    [37, 38, 39, 40].includes(e.keyCode) // arrow keys
  ) {
    return;
  } else if (e.key === "*") {
    e.preventDefault();
    expression.setRangeText(
      "×",
      expression.selectionStart,
      expression.selectionEnd,
      "end"
    );
  } else if (e.key === "/") {
    e.preventDefault();
    expression.setRangeText(
      "÷",
      expression.selectionStart,
      expression.selectionEnd,
      "end"
    );
  } else {
    e.preventDefault();
  }
});
