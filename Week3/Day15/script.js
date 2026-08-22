/* ============================================================
   Week 3 · Day 15 — Calculator App (JS Fundamentals Combined)
   Built.
   Author: Hamdan Ali
   ============================================================ */

/* ============================================================
   PART 1 — CalcEngine
   Pure calculation logic. Deliberately has zero references to
   `document` anywhere in this section — it only knows about
   numbers and operators, not buttons or screens. That means it
   could be lifted into a unit test file, a CLI tool, or a
   completely different UI without a single line changing.
   ============================================================ */

const CalcEngine = {
  firstOperand: null,
  operator: null,
  secondOperand: null,
  waitingForSecondOperand: false,
  memory: 0,
  hasError: false,

  /** Resets the engine back to its starting state (AC). */
  reset() {
    this.firstOperand = null;
    this.operator = null;
    this.secondOperand = null;
    this.waitingForSecondOperand = false;
    this.hasError = false;
  },

  /**
   * Records which operator was pressed (+, -, ×, ÷) and, if a
   * calculation was already in progress, resolves it first —
   * this is what makes chained calculations like 4 + 3 + 2 work.
   */
  chooseOperator(nextOperator, currentValue) {
    if (this.hasError) return currentValue;

    if (this.firstOperand === null) {
      this.firstOperand = currentValue;
    } else if (this.operator && !this.waitingForSecondOperand) {
      const result = this.compute(this.firstOperand, currentValue, this.operator);
      if (result === null) {
        this.hasError = true;
        return null;
      }
      this.firstOperand = result;
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
    return this.firstOperand;
  },

  /**
   * The actual arithmetic. Returns null (instead of Infinity/NaN)
   * on divide-by-zero, so the UI layer has one clear signal to
   * watch for rather than checking multiple special values.
   */
  compute(first, second, operator) {
    switch (operator) {
      case "+":
        return this.roundClean(first + second);
      case "-":
        return this.roundClean(first - second);
      case "×":
        return this.roundClean(first * second);
      case "÷":
        if (second === 0) return null; // divide by zero → caller shows "Error"
        return this.roundClean(first / second);
      default:
        return second;
    }
  },

  /**
   * Rounds away classic floating-point noise (0.1 + 0.2 producing
   * 0.30000000000000004) without truncating legitimate precision.
   */
  roundClean(value) {
    return Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  },

  /** Resolves the pending calculation when "=" is pressed. */
  equals(currentValue) {
    if (this.hasError || this.operator === null) return currentValue;

    const result = this.compute(this.firstOperand, currentValue, this.operator);
    if (result === null) {
      this.hasError = true;
      return null;
    }

    this.firstOperand = result;
    this.operator = null;
    this.waitingForSecondOperand = false;
    return result;
  },

  // ---- Memory register ----
  memoryAdd(value) { this.memory += value; },
  memorySubtract(value) { this.memory -= value; },
  memoryRecall() { return this.memory; },
  memoryClear() { this.memory = 0; },
};

/* ============================================================
   PART 2 — UI Controller
   Everything below this line is the only part of the file
   allowed to touch the DOM. It reads button presses and key
   events, hands the numbers to CalcEngine, and writes whatever
   comes back onto the screen.
   ============================================================ */

const display = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const historyList = document.getElementById("history-list");
const memoryIndicator = document.getElementById("memory-indicator");
const themeToggle = document.getElementById("theme-toggle");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let history = [];

function updateDisplay() {
  display.textContent = CalcEngine.hasError ? "Error" : formatForDisplay(currentInput);
  memoryIndicator.hidden = CalcEngine.memory === 0;
}

/** Adds thousands separators for readability without touching the underlying value used in math. */
function formatForDisplay(value) {
  if (value === "Error") return value;
  const [intPart, decimalPart] = value.split(".");
  const withCommas = Number(intPart).toLocaleString("en-US");
  return decimalPart !== undefined ? `${withCommas}.${decimalPart}` : withCommas;
}

function inputDigit(digit) {
  if (CalcEngine.hasError) return;

  if (CalcEngine.waitingForSecondOperand) {
    currentInput = digit;
    CalcEngine.waitingForSecondOperand = false;
  } else {
    currentInput = currentInput === "0" ? digit : currentInput + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (CalcEngine.hasError) return;

  if (CalcEngine.waitingForSecondOperand) {
    currentInput = "0.";
    CalcEngine.waitingForSecondOperand = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

function handleOperator(nextOperator) {
  if (CalcEngine.hasError) return;

  const currentValue = parseFloat(currentInput);
  const result = CalcEngine.chooseOperator(nextOperator, currentValue);

  if (result === null) {
    showError();
    return;
  }

  expressionEl.textContent = `${formatForDisplay(String(result))} ${nextOperator}`;
  currentInput = String(result);
  updateDisplay();
}

function handleEquals() {
  if (CalcEngine.hasError || CalcEngine.operator === null) return;

  const currentValue = parseFloat(currentInput);
  const expressionText = `${formatForDisplay(String(CalcEngine.firstOperand))} ${CalcEngine.operator} ${formatForDisplay(currentInput)} =`;
  const result = CalcEngine.equals(currentValue);

  if (result === null) {
    showError();
    return;
  }

  addToHistory(expressionText, result);
  expressionEl.textContent = "";
  currentInput = String(result);
  updateDisplay();
}

function showError() {
  currentInput = "0";
  updateDisplay();
  expressionEl.textContent = "";
  setTimeout(() => {
    CalcEngine.reset();
    updateDisplay();
  }, 1200);
}

function allClear() {
  CalcEngine.reset();
  currentInput = "0";
  expressionEl.textContent = "";
  updateDisplay();
}

function clearEntry() {
  if (CalcEngine.hasError) { allClear(); return; }
  currentInput = "0";
  updateDisplay();
}

function backspace() {
  if (CalcEngine.hasError) { allClear(); return; }
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  updateDisplay();
}

function toggleSign() {
  if (CalcEngine.hasError || currentInput === "0") return;
  currentInput = currentInput.startsWith("-") ? currentInput.slice(1) : `-${currentInput}`;
  updateDisplay();
}

function applyPercent() {
  if (CalcEngine.hasError) return;
  currentInput = String(CalcEngine.roundClean(parseFloat(currentInput) / 100));
  updateDisplay();
}

function addToHistory(expressionText, result) {
  history.unshift({ expressionText, result });
  history = history.slice(0, 8); // keep the panel to a readable length
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "Your calculations will appear here.";
    historyList.appendChild(empty);
    return;
  }

  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    const li = document.createElement("li");
    li.className = "history-entry";
    li.innerHTML = `
      <span class="history-expression">${entry.expressionText}</span>
      <span class="history-result">${formatForDisplay(String(entry.result))}</span>
    `;
    li.tabIndex = 0;
    li.addEventListener("click", () => reuseHistoryEntry(entry.result));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") reuseHistoryEntry(entry.result);
    });
    historyList.appendChild(li);
  }
}

/** Clicking a history row loads that result back into the display, ready for another operation. */
function reuseHistoryEntry(result) {
  CalcEngine.reset();
  currentInput = String(result);
  expressionEl.textContent = "";
  updateDisplay();
}

// ---- Memory button handlers ----
function handleMemory(action) {
  if (CalcEngine.hasError) return;
  const value = parseFloat(currentInput);

  switch (action) {
    case "m-plus":
      CalcEngine.memoryAdd(value);
      break;
    case "m-minus":
      CalcEngine.memorySubtract(value);
      break;
    case "mr":
      currentInput = String(CalcEngine.memoryRecall());
      break;
    case "mc":
      CalcEngine.memoryClear();
      break;
  }
  updateDisplay();
}

// ---- Button wiring (event delegation — one listener for the whole keypad) ----
keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { digit, action, operator, memory } = button.dataset;

  if (digit !== undefined) inputDigit(digit);
  else if (operator !== undefined) handleOperator(operator);
  else if (memory !== undefined) handleMemory(memory);
  else if (action === "decimal") inputDecimal();
  else if (action === "equals") handleEquals();
  else if (action === "all-clear") allClear();
  else if (action === "clear-entry") clearEntry();
  else if (action === "backspace") backspace();
  else if (action === "sign") toggleSign();
  else if (action === "percent") applyPercent();

  button.classList.add("is-pressed");
  setTimeout(() => button.classList.remove("is-pressed"), 120);
});

// ---- Full keyboard support ----
const KEY_MAP = { "*": "×", "/": "÷" };

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) { inputDigit(key); return; }
  if (key === ".") { inputDecimal(); return; }
  if (["+", "-", "*", "/"].includes(key)) { handleOperator(KEY_MAP[key] || key); return; }
  if (key === "Enter" || key === "=") { event.preventDefault(); handleEquals(); return; }
  if (key === "Escape") { allClear(); return; }
  if (key === "Backspace") { backspace(); return; }
  if (key === "%") { applyPercent(); return; }
});

// ---- Theme toggle, saved between visits ----
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", theme === "dark");
  localStorage.setItem("calc-theme", theme);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ---- Init ----
applyTheme(localStorage.getItem("calc-theme") || "light");
renderHistory();
updateDisplay();
