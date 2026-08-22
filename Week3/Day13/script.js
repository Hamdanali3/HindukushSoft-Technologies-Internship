/* ============================================================
   Week 3 · Day 13 — Functions, Parameters & Return Values
   Task: Create a function that takes a name as input and
         prints a greeting message on the webpage.
   Topics covered: functions, parameters, return values
   Author: Hamdan Ali
   ============================================================ */

// ---- Element references ----
const nameInput = document.getElementById("name-input");
const greetBtn = document.getElementById("greet-btn");
const output = document.getElementById("greeting-output");

/**
 * Picks a time-appropriate greeting word based on the current hour.
 * This function takes no parameters, but it DOES return a value —
 * proof that a function doesn't need input to still be useful.
 *
 * @returns {string} "Good morning" | "Good afternoon" | "Good evening"
 */
function getTimeOfDayGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Capitalizes the first letter of a name and lowercases the rest,
 * so "hAMDAN" and "hamdan" both come out as "Hamdan".
 *
 * @param {string} name - the raw name text
 * @returns {string} the cleaned-up, capitalized name
 */
function formatName(name) {
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/**
 * This is the core function the task asks for: it TAKES a name as
 * a parameter and RETURNS a complete greeting message. Notice that
 * it doesn't touch the webpage at all — it just hands back a string.
 * Keeping it this way means it could be reused anywhere (a console
 * log, an alert, a different page) without being tied to this UI.
 *
 * @param {string} name - the person's name
 * @returns {string} a full greeting sentence
 */
function createGreeting(name) {
  if (!name || name.trim() === "") {
    return "Please enter a name so I know who I'm greeting.";
  }

  const cleanName = formatName(name);
  const timeGreeting = getTimeOfDayGreeting();

  return `${timeGreeting}, ${cleanName}! Welcome to my Full Stack Web Development internship project.`;
}

/**
 * This function is the one place that actually touches the DOM.
 * It reads the input field, calls createGreeting() to get the
 * message, and writes that message onto the page.
 */
function displayGreeting() {
  const message = createGreeting(nameInput.value);

  output.textContent = message;
  output.classList.add("greeting-output--visible");

  console.log(`[Day 13] ${message}`);
}

// ---- Event wiring ----
greetBtn.addEventListener("click", displayGreeting);

// Also allow pressing "Enter" inside the input field to trigger it.
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    displayGreeting();
  }
});
