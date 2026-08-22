/* ============================================================
   Week 4 · Day 17 — DOM Events
   Task: Create buttons that change color and text on click.
   Topics covered: onclick, addEventListener
   Author: Hamdan Ali
   ============================================================ */

/* ============================================================
   Event console — a visible trace of every click handled below,
   shared by both the Reaction Bar and the Button Lab.
   ============================================================ */

const consoleList = document.getElementById("console-list");

function logEvent(line) {
  const entry = document.createElement("li");
  entry.className = "console-entry";
  entry.textContent = line;
  consoleList.insertBefore(entry, consoleList.firstChild);
  while (consoleList.children.length > 7) {
    consoleList.removeChild(consoleList.lastChild);
  }
}

/* ============================================================
   SECTION 1 — Reaction Bar
   Every button here uses addEventListener, since a reaction
   button needs to support being clicked (and un-clicked) any
   number of times — a plain .onclick assignment would work
   for this too, but addEventListener is the right default for
   anything that isn't deliberately demonstrating the property
   form specifically (that's what the Button Lab is for).
   ============================================================ */

const reactionButtons = document.querySelectorAll(".reaction");
const reactionCounts = { thumbsup: 0, thumbsdown: 0, heart: 0, tada: 0, smile: 0, confused: 0 };

reactionButtons.forEach((button) => {
  const reactionName = button.dataset.reaction;
  const glowColor = button.dataset.glow;
  const countLabel = button.querySelector(".reaction-count");

  button.addEventListener("click", () => {
    const isActive = button.classList.toggle("is-active");
    reactionCounts[reactionName] += isActive ? 1 : -1;
    countLabel.textContent = reactionCounts[reactionName];

    // The glow color is per-button (read from its own data-glow
    // attribute), so one shared handler can still give each
    // reaction its own distinct active color.
    button.style.setProperty("--glow", glowColor);

    logEvent(`click → #${reactionName} (addEventListener) — ${isActive ? "added" : "removed"}, count: ${reactionCounts[reactionName]}`);
  });
});

/* ============================================================
   SECTION 2 — Button Lab
   ============================================================ */

/* ---- 2a. The .onclick property ----
   Assigning a function directly to element.onclick is the
   JavaScript-side equivalent of an inline onclick="" attribute
   in the HTML, without mixing markup and behavior. Its
   limitation, shown deliberately here, is that it can only
   ever hold ONE function — assigning a second one would
   silently replace the first, unlike addEventListener. */

const onclickDemoBtn = document.getElementById("onclick-demo-btn");
const cycleColors = ["#FF6B35", "#2F6FED", "#1E9E6B", "#C23B6C", "#7B5CE0"];
let cycleIndex = 0;

onclickDemoBtn.onclick = function () {
  cycleIndex = (cycleIndex + 1) % cycleColors.length;
  const color = cycleColors[cycleIndex];
  this.style.backgroundColor = color;
  this.textContent = `Color #${cycleIndex + 1} of ${cycleColors.length}`;
  logEvent(`click → #onclick-demo-btn (element.onclick property) — set to ${color}`);
};

/* ---- 2b. Multiple stacked listeners ----
   Two independent addEventListener calls on the same button.
   Both run, in the order they were attached, from one click —
   this is the exact behavior a single .onclick assignment
   could NOT give you. */

const stackedBtn = document.getElementById("stacked-btn");
const stackedCountEl = document.getElementById("stacked-count");
let stackedClicks = 0;

stackedBtn.addEventListener("click", () => {
  stackedBtn.classList.toggle("lab-btn--flash");
  logEvent("click → #stacked-btn (listener 1 of 2) — toggled flash state");
});

stackedBtn.addEventListener("click", () => {
  stackedClicks++;
  stackedCountEl.textContent = stackedClicks;
  logEvent(`click → #stacked-btn (listener 2 of 2) — count now ${stackedClicks}`);
});

/* ---- 2c. Reading the event object ----
   The function passed to addEventListener automatically
   receives the event itself as its first argument — this
   button reports a few properties straight from it. */

const inspectorBtn = document.getElementById("inspector-btn");
const inspectorOutput = document.getElementById("inspector-output");

inspectorBtn.addEventListener("click", (event) => {
  const details = `type: "${event.type}" · target: <${event.target.tagName.toLowerCase()}> · at (${event.clientX}, ${event.clientY})`;
  inspectorOutput.textContent = details;
  logEvent(`click → #inspector-btn (event object) — ${details}`);
});

/* ---- 2d. A listener that removes itself ----
   The { once: true } option tells addEventListener to detach
   the handler automatically right after it fires once — no
   manual removeEventListener call needed. */

const onceBtn = document.getElementById("once-btn");

onceBtn.addEventListener(
  "click",
  () => {
    onceBtn.textContent = "Already used";
    onceBtn.classList.add("lab-btn--spent");
    onceBtn.disabled = true;
    logEvent("click → #once-btn ({ once: true }) — listener has now detached itself");
  },
  { once: true }
);

/* ---- 2e. The plain color + text toggle ----
   The most direct version of the task: one click, a new
   background color, new label text. */

const toggleBtn = document.getElementById("toggle-btn");
let notificationsOn = false;

toggleBtn.addEventListener("click", () => {
  notificationsOn = !notificationsOn;
  toggleBtn.textContent = notificationsOn ? "Notifications On" : "Notifications Off";
  toggleBtn.classList.toggle("lab-btn--off", !notificationsOn);
  toggleBtn.classList.toggle("lab-btn--on", notificationsOn);
  logEvent(`click → #toggle-btn (addEventListener) — now ${notificationsOn ? "ON" : "OFF"}`);
});

/* ============================================================
   Init
   ============================================================ */
logEvent("Signal Panel ready — try any button above.");