/* ============================================================
   Week 4 · Day 16 — DOM Selectors
   Task: Select HTML elements and dynamically change text and
         styles using JavaScript.
   Topics covered: getElementById, querySelector, querySelectorAll
   Author: Hamdan Ali
   ============================================================ */

/* ============================================================
   PART 1 — Selecting every element up front.
   Each element is looked up exactly once here and reused by
   every event handler below — none of the handlers re-query
   the DOM on every keystroke or click.
   ============================================================ */

// ---- getElementById: used for every element with a unique id ----
const titleInput = document.getElementById("control-title");
const roleInput = document.getElementById("control-role");
const bioInput = document.getElementById("control-bio");
const fontSelect = document.getElementById("control-font");
const radiusInput = document.getElementById("control-radius");
const radiusValueLabel = document.getElementById("radius-value");
const shadowToggle = document.getElementById("control-shadow");
const darkCanvasToggle = document.getElementById("control-dark-canvas");
const resetBtn = document.getElementById("reset-btn");
const copyBtn = document.getElementById("copy-btn");
const logList = document.getElementById("log-list");
const canvasWrap = document.getElementById("canvas-wrap");
const previewCard = document.getElementById("preview-card");
const previewAvatar = document.getElementById("preview-avatar");
const previewTitle = document.getElementById("preview-title");

// ---- querySelector: elements picked out by class/compound selector ----
// (previewTitle above already has an id, so these two deliberately use
// class selectors instead, to show the alternative syntax in real use.)
const previewRole = document.querySelector("#preview-card .preview-role");
const previewBio = document.querySelector("#preview-card .preview-bio");

// ---- querySelectorAll: a repeated group of elements ----
const swatchButtons = document.querySelectorAll("#swatch-row .swatch");

// The starting values, kept so the Reset button has something to return to.
const DEFAULTS = {
  title: titleInput.value,
  role: roleInput.value,
  bio: bioInput.value,
  color: "#FF6B35",
  font: fontSelect.value,
  radius: radiusInput.value,
  shadow: true,
  darkCanvas: false,
};

/* ============================================================
   PART 2 — The selector log.
   A small, honest trace of exactly which DOM call just ran,
   so the concept behind this task is visible, not hidden.
   ============================================================ */

function logAction(codeLine) {
  const entry = document.createElement("li");
  entry.className = "log-entry";
  entry.textContent = codeLine;
  logList.insertBefore(entry, logList.firstChild);

  // Keep the log readable — only show the most recent entries.
  while (logList.children.length > 6) {
    logList.removeChild(logList.lastChild);
  }
}

/* ============================================================
   PART 3 — Text content handlers
   ============================================================ */

titleInput.addEventListener("input", () => {
  previewTitle.textContent = titleInput.value || "Untitled";
  logAction(`document.getElementById("preview-title").textContent = "${titleInput.value}"`);
});

roleInput.addEventListener("input", () => {
  previewRole.textContent = roleInput.value;
  logAction(`document.querySelector(".preview-role").textContent = "${roleInput.value}"`);
});

bioInput.addEventListener("input", () => {
  previewBio.textContent = bioInput.value;
  logAction(`document.querySelector(".preview-bio").textContent = "${bioInput.value}"`);
});

/* ============================================================
   PART 4 — Style handlers
   ============================================================ */

function applyAccentColor(color) {
  previewCard.style.setProperty("--accent", color);
  previewAvatar.style.background = color;
  logAction(`document.getElementById("preview-card").style.setProperty("--accent", "${color}")`);
}

swatchButtons.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatchButtons.forEach((s) => s.classList.remove("is-active"));
    swatch.classList.add("is-active");
    applyAccentColor(swatch.dataset.color);
  });
});

fontSelect.addEventListener("change", () => {
  previewCard.style.fontFamily = fontSelect.value;
  logAction(`document.getElementById("preview-card").style.fontFamily = "${fontSelect.value}"`);
});

radiusInput.addEventListener("input", () => {
  const px = `${radiusInput.value}px`;
  previewCard.style.borderRadius = px;
  radiusValueLabel.textContent = px;
  logAction(`document.getElementById("preview-card").style.borderRadius = "${px}"`);
});

shadowToggle.addEventListener("change", () => {
  previewCard.classList.toggle("preview-card--shadow", shadowToggle.checked);
  logAction(`document.getElementById("preview-card").classList.toggle("preview-card--shadow", ${shadowToggle.checked})`);
});

darkCanvasToggle.addEventListener("change", () => {
  canvasWrap.classList.toggle("canvas-wrap--dark", darkCanvasToggle.checked);
  logAction(`document.getElementById("canvas-wrap").classList.toggle("canvas-wrap--dark", ${darkCanvasToggle.checked})`);
});

/* ============================================================
   PART 5 — Reset
   ============================================================ */

function resetStudio() {
  titleInput.value = DEFAULTS.title;
  roleInput.value = DEFAULTS.role;
  bioInput.value = DEFAULTS.bio;
  fontSelect.value = DEFAULTS.font;
  radiusInput.value = DEFAULTS.radius;
  shadowToggle.checked = DEFAULTS.shadow;
  darkCanvasToggle.checked = DEFAULTS.darkCanvas;

  previewTitle.textContent = DEFAULTS.title;
  previewRole.textContent = DEFAULTS.role;
  previewBio.textContent = DEFAULTS.bio;
  previewCard.style.fontFamily = DEFAULTS.font;
  previewCard.style.borderRadius = `${DEFAULTS.radius}px`;
  previewCard.classList.toggle("preview-card--shadow", DEFAULTS.shadow);
  canvasWrap.classList.toggle("canvas-wrap--dark", DEFAULTS.darkCanvas);
  radiusValueLabel.textContent = `${DEFAULTS.radius}px`;

  swatchButtons.forEach((s) => s.classList.toggle("is-active", s.dataset.color === DEFAULTS.color));
  applyAccentColor(DEFAULTS.color);

  logAction("— reset to defaults —");
}

resetBtn.addEventListener("click", resetStudio);

/* ============================================================
   PART 6 — Copy the styled card as real HTML
   The practical payoff: the result can actually be used
   elsewhere, not just admired on screen.
   ============================================================ */

copyBtn.addEventListener("click", async () => {
  const markup = previewCard.outerHTML;

  try {
    await navigator.clipboard.writeText(markup);
    flashCopyButton("Copied!");
    return;
  } catch (err) {
    // Clipboard API can be unavailable in a plain file:// context —
    // fall back to a manual-select textarea instead of failing silently.
  }

  const tempArea = document.createElement("textarea");
  tempArea.value = markup;
  tempArea.style.position = "fixed";
  tempArea.style.opacity = "0";
  document.body.appendChild(tempArea);
  tempArea.select();

  try {
    document.execCommand("copy");
    flashCopyButton("Copied!");
  } catch (err) {
    flashCopyButton("Copy failed — select manually");
  } finally {
    document.body.removeChild(tempArea);
  }
});

function flashCopyButton(message) {
  const original = copyBtn.textContent;
  copyBtn.textContent = message;
  copyBtn.disabled = true;
  setTimeout(() => {
    copyBtn.textContent = original;
    copyBtn.disabled = false;
  }, 1400);
}

/* ============================================================
   Init
   ============================================================ */
logAction("Studio ready — try editing the card.");
