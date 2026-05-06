const menu = document.getElementById("menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuItems = document.querySelectorAll(".menu-item");
const panels = document.querySelectorAll(".panel");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((button) => button.classList.remove("is-active"));
    panels.forEach((panel) => panel.classList.remove("is-active"));

    item.classList.add("is-active");
    const target = document.getElementById(item.dataset.target);
    if (target) {
      target.classList.add("is-active");
    }

    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

menuToggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const angleButton = document.getElementById("angleMode");
const calculator = document.querySelector(".calculator");

let expression = "";
let lastAnswer = 0;
let angleMode = "DEG";
let justEvaluated = false;

const functionTokens = [
  "sin(",
  "cos(",
  "tan(",
  "asin(",
  "acos(",
  "atan(",
  "log(",
  "ln(",
  "sqrt(",
  "abs(",
  "exp(",
];

const operatorTokens = ["+", "-", "*", "/", "^"];

const toRadians = (value) => (angleMode === "DEG" ? (value * Math.PI) / 180 : value);
const fromRadians = (value) => (angleMode === "DEG" ? (value * 180) / Math.PI : value);

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }
  const rounded = Math.round(value * 1e12) / 1e12;
  return String(rounded);
};

const factorial = (value) => {
  if (!Number.isFinite(value) || value < 0) {
    return NaN;
  }
  if (!Number.isInteger(value)) {
    return NaN;
  }
  if (value > 170) {
    return Infinity;
  }
  let total = 1;
  for (let i = 2; i <= value; i += 1) {
    total *= i;
  }
  return total;
};

const replaceFactorials = (expr) => {
  let result = "";
  for (let i = 0; i < expr.length; i += 1) {
    const char = expr[i];
    if (char !== "!") {
      result += char;
      continue;
    }

    let j = result.length - 1;
    if (j < 0) {
      continue;
    }

    if (result[j] === ")") {
      let depth = 1;
      j -= 1;
      while (j >= 0 && depth > 0) {
        if (result[j] === ")") {
          depth += 1;
        } else if (result[j] === "(") {
          depth -= 1;
        }
        j -= 1;
      }
      const start = j + 1;
      const operand = result.slice(start);
      result = `${result.slice(0, start)}factorial${operand}`;
    } else {
      while (j >= 0 && /[0-9.]/.test(result[j])) {
        j -= 1;
      }
      while (j >= 0 && /[a-zA-Z_]/.test(result[j])) {
        j -= 1;
      }
      const start = j + 1;
      const operand = result.slice(start);
      result = `${result.slice(0, start)}factorial(${operand})`;
    }
  }
  return result;
};

const sanitizeExpression = (expr) => {
  let normalized = expr;
  normalized = normalized.replace(/ANS/gi, "ans");
  normalized = normalized.replace(/\^/g, "**");
  normalized = replaceFactorials(normalized);
  return normalized;
};

const createContext = () => ({
  sin: (value) => Math.sin(toRadians(value)),
  cos: (value) => Math.cos(toRadians(value)),
  tan: (value) => Math.tan(toRadians(value)),
  asin: (value) => fromRadians(Math.asin(value)),
  acos: (value) => fromRadians(Math.acos(value)),
  atan: (value) => fromRadians(Math.atan(value)),
  log: (value) => Math.log10(value),
  ln: (value) => Math.log(value),
  sqrt: (value) => Math.sqrt(value),
  abs: (value) => Math.abs(value),
  exp: (value) => Math.exp(value),
  factorial,
  pi: Math.PI,
  e: Math.E,
  ans: lastAnswer,
});

const evaluateExpression = (expr) => {
  const normalized = sanitizeExpression(expr);
  const context = createContext();
  const evaluator = new Function("context", `with (context) { return ${normalized}; }`);
  return evaluator(context);
};

const updateDisplay = (liveValue) => {
  expressionEl.textContent = expression || "0";
  if (typeof liveValue === "number") {
    resultEl.textContent = formatNumber(liveValue);
  } else if (!expression) {
    resultEl.textContent = "0";
  }
};

const updateLiveResult = () => {
  if (!expression) {
    updateDisplay();
    return;
  }
  try {
    const value = evaluateExpression(expression);
    updateDisplay(value);
  } catch (error) {
    updateDisplay();
  }
};

const endsWithValue = () => /(\d|\)|pi|e|ans)$/i.test(expression);

const shouldInsertMultiply = (nextValue) => {
  if (!expression) {
    return false;
  }
  const isFunction = functionTokens.includes(nextValue);
  const isConstant = ["pi", "e", "ans"].includes(nextValue);
  const opensGroup = nextValue === "(";
  return endsWithValue() && (isFunction || isConstant || opensGroup);
};

const appendNumber = (value) => {
  if (justEvaluated) {
    expression = "";
    justEvaluated = false;
  }

  if (value === ".") {
    const lastNumber = expression.split(/[^0-9.]/).pop();
    if (lastNumber.includes(".")) {
      return;
    }
    if (!lastNumber) {
      expression += "0";
    }
  }

  expression += value;
  updateLiveResult();
};

const appendOperator = (value) => {
  if (!expression && value === "-") {
    expression = "-";
    updateLiveResult();
    return;
  }
  if (!expression) {
    return;
  }
  if (operatorTokens.includes(expression.slice(-1))) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }
  justEvaluated = false;
  updateLiveResult();
};

const appendFunction = (value) => {
  if (shouldInsertMultiply(value)) {
    expression += "*";
  }
  expression += value;
  justEvaluated = false;
  updateLiveResult();
};

const appendConstant = (value) => {
  if (shouldInsertMultiply(value)) {
    expression += "*";
  }
  expression += value;
  justEvaluated = false;
  updateLiveResult();
};

const handleInput = (value) => {
  if (shouldInsertMultiply(value)) {
    expression += "*";
  }
  expression += value;
  justEvaluated = false;
  updateLiveResult();
};

const applyPercent = () => {
  const match = expression.match(/(.*?)(-?\d+(\.\d+)?)(?!.*\d)/);
  if (!match) {
    return;
  }
  const prefix = match[1];
  const number = Number(match[2]);
  const result = number / 100;
  expression = `${prefix}${result}`;
  updateLiveResult();
};

const toggleSign = () => {
  if (!expression) {
    expression = "-";
    updateLiveResult();
    return;
  }

  const match = expression.match(/(.*?)(-?\d+(\.\d+)?)(?!.*\d)/);
  if (!match) {
    expression = `(-1*(${expression}))`;
    updateLiveResult();
    return;
  }

  const prefix = match[1];
  let number = match[2];
  number = number.startsWith("-") ? number.slice(1) : `-${number}`;
  expression = `${prefix}${number}`;
  updateLiveResult();
};

const clearAll = () => {
  expression = "";
  lastAnswer = 0;
  justEvaluated = false;
  updateDisplay();
};

const backspace = () => {
  expression = expression.slice(0, -1);
  updateLiveResult();
};

const evaluateNow = () => {
  if (!expression) {
    return;
  }
  try {
    const value = evaluateExpression(expression);
    lastAnswer = value;
    expression = formatNumber(value);
    justEvaluated = true;
    updateDisplay(value);
  } catch (error) {
    resultEl.textContent = "Error";
  }
};

const toggleAngleMode = () => {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  angleButton.textContent = angleMode;
  updateLiveResult();
};

calculator.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  switch (action) {
    case "number":
      appendNumber(value);
      break;
    case "operator":
      appendOperator(value);
      break;
    case "function":
      appendFunction(value);
      break;
    case "constant":
      appendConstant(value);
      break;
    case "input":
      handleInput(value);
      break;
    case "percent":
      applyPercent();
      break;
    case "factorial":
      handleInput("!");
      break;
    case "negate":
      toggleSign();
      break;
    case "clear":
      clearAll();
      break;
    case "backspace":
      backspace();
      break;
    case "evaluate":
      evaluateNow();
      break;
    case "toggle-angle":
      toggleAngleMode();
      break;
    default:
      break;
  }
});

window.addEventListener("keydown", (event) => {
  const { key } = event;
  if (/[0-9]/.test(key)) {
    appendNumber(key);
    return;
  }

  if (key === ".") {
    appendNumber(".");
    return;
  }

  if (operatorTokens.includes(key)) {
    appendOperator(key);
    return;
  }

  if (key === "Enter") {
    event.preventDefault();
    evaluateNow();
    return;
  }

  if (key === "Backspace") {
    backspace();
    return;
  }

  if (key === "Escape") {
    clearAll();
  }
});

updateDisplay();
