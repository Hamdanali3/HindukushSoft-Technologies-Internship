/* ============================================================
   Week 3 · Day 12 — Conditionals And Comparison Operators
   Task: Prompt the user for their age and display whether
         they are eligible to vote.
   Topics covered: if / else, comparison operators
   Author: Hamdan Ali
   ============================================================ */

// Pakistan's legal voting age is 18 — used as the eligibility
// threshold throughout this file, kept in one place so it's
// easy to change if the rule is ever different.
const VOTING_AGE = 18;

// Grabs the result box on the page so we can display the
// outcome there instead of relying only on alert() popups.
const resultBox = document.getElementById("result");

function checkVotingEligibility() {
  // window.prompt() always returns a string (or null if the
  // user hits "Cancel"), so the raw input needs converting
  // and validating before it's treated like a real age.
  const rawInput = prompt("Please enter your age:");

  // Case 1: the user clicked "Cancel" — do nothing.
  if (rawInput === null) {
    showResult("No age entered. Click the button whenever you're ready to check.", "neutral");
    return;
  }

  // Case 2: the field was left empty or contains non‑numeric text.
  const age = Number(rawInput.trim());

  if (rawInput.trim() === "" || Number.isNaN(age)) {
    showResult(`"${rawInput}" isn't a valid number. Please enter your age using digits only.`, "error");
    return;
  }

  // Case 3: a negative number or an unrealistic age slipped through.
  if (age < 0 || age > 120) {
    showResult(`${age} doesn't look like a real age. Please try again.`, "error");
    return;
  }

  // --- The actual eligibility check ---
  // This is the comparison operator (>=) doing the real work:
  // it checks whether `age` is greater than or equal to VOTING_AGE.
  if (age >= VOTING_AGE) {
    showResult(`You're ${age} — that's ${VOTING_AGE} or older, so you're eligible to vote.`, "success");
  } else {
    // The else branch covers every age that failed the check above.
    const yearsLeft = VOTING_AGE - age;
    const yearWord = yearsLeft === 1 ? "year" : "years";
    showResult(`You're ${age} — that's under ${VOTING_AGE}, so you're not eligible to vote yet. ${yearsLeft} ${yearWord} to go.`, "warning");
  }
}

// Updates the result card on the page and logs the same
// message to the console, so the outcome is visible either way.
function showResult(message, status) {
  console.log(`[Voting Eligibility] ${message}`);

  resultBox.textContent = message;
  resultBox.className = `result result--${status}`;
}

// Wire the button up once the page has loaded.
document.getElementById("check-btn").addEventListener("click", checkVotingEligibility);
