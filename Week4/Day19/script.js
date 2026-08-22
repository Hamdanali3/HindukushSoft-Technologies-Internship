/* ==========================================================================
   ANCHOR — storing and retrieving a user's name and theme with localStorage
   ========================================================================== */

const STORAGE_KEY = "anchor:profile";

// ---- DOM references --------------------------------------------------------
const root = document.documentElement;

const onboardForm = document.getElementById("onboardForm");
const nameInput = document.getElementById("nameInput");
const nameField = nameInput.closest(".field");
const nameError = document.getElementById("nameError");

const greetingEyebrow = document.getElementById("greetingEyebrow");
const greetingName = document.getElementById("greetingName");
const visitLine = document.getElementById("visitLine");
const storageOutput = document.getElementById("storageOutput");
const forgetBtn = document.getElementById("forgetBtn");
const dashThemeOptions = document.getElementById("dashThemeOptions");

/* ============================================================================
   Reading and writing the profile
   ----------------------------------------------------------------------------
   Everything about this visitor — name, chosen theme, visit count, and the
   two timestamps — lives under a single key, as one JSON object, rather than
   as five separate localStorage entries. localStorage only stores strings,
   so writing means JSON.stringify() and reading means JSON.parse(); wrapping
   both in a small helper keeps that detail in one place instead of repeated
   at every call site.
   ============================================================================ */

function readProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Someone (or some extension) hand-edited localStorage into something
    // that isn't valid JSON. Rather than let the whole page crash on a
    // parse error, treat it the same as "no profile yet."
    console.warn("Saved profile was unreadable, starting fresh.", err);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writeProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  renderStorageInspector(profile);
}

// ---- The "under the hood" panel just mirrors whatever was last written ----
function renderStorageInspector(profile) {
  if (!storageOutput) return;
  storageOutput.textContent = JSON.stringify(profile, null, 2);
}

/* ============================================================================
   Onboarding: live theme preview + validated submit
   ============================================================================ */

// Selecting a swatch previews the theme immediately, even before the form
// is submitted — you're choosing a mood, so you should be able to see it.
onboardForm.querySelectorAll('input[name="theme"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    root.setAttribute("data-theme", radio.value);
    syncActiveThemeOption(onboardForm, radio.value);
  });
});

function syncActiveThemeOption(scope, value) {
  scope.querySelectorAll(".theme-option").forEach((option) => {
    const optionValue = option.dataset.themeOption;
    option.classList.toggle("is-active", optionValue === value);
  });
}

function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Tell us what to call you.";
  if (trimmed.length < 2) return "That's a little short for a name.";
  return "";
}

onboardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const errorMessage = validateName(nameInput.value);
  nameField.classList.toggle("is-invalid", Boolean(errorMessage));
  nameError.textContent = errorMessage;

  if (errorMessage) {
    nameInput.focus();
    return;
  }

  const selectedTheme = onboardForm.querySelector('input[name="theme"]:checked').value;
  const now = new Date().toISOString();

  const profile = {
    name: nameInput.value.trim(),
    theme: selectedTheme,
    visits: 1,
    firstSeen: now,
    lastSeen: now,
  };

  writeProfile(profile);
  root.setAttribute("data-theme", profile.theme);
  root.setAttribute("data-screen", "dashboard");
  renderDashboard(profile, { justOnboarded: true });
});

/* ============================================================================
   Dashboard: greet the visitor, let them change their mood, show the raw data
   ============================================================================ */

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function describeRelativeTime(isoString) {
  const then = new Date(isoString).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function renderDashboard(profile, { justOnboarded = false } = {}) {
  greetingEyebrow.textContent = timeOfDayGreeting();
  greetingName.textContent = justOnboarded ? `You're in, ${profile.name}.` : `Welcome back, ${profile.name}.`;

  if (profile.visits <= 1) {
    visitLine.textContent = "This is your first visit — glad you're here.";
  } else {
    visitLine.textContent = `This is visit #${profile.visits} — you were last here ${describeRelativeTime(profile.previousLastSeen || profile.lastSeen)}.`;
  }

  syncActiveThemeOption(dashThemeOptions, profile.theme);
  renderStorageInspector(profile);
}

// Changing the mood from the dashboard saves instantly — no submit button,
// no "unsaved changes." The moment you pick it, it's in localStorage.
dashThemeOptions.querySelectorAll(".theme-option").forEach((button) => {
  button.addEventListener("click", () => {
    const profile = readProfile();
    if (!profile) return;

    const newTheme = button.dataset.themeValue;
    profile.theme = newTheme;
    writeProfile(profile);

    root.setAttribute("data-theme", newTheme);
    syncActiveThemeOption(dashThemeOptions, newTheme);
  });
});

// ---- Forgetting this device: the other half of localStorage, removeItem ---
forgetBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  root.setAttribute("data-screen", "onboarding");
  root.setAttribute("data-theme", "light");

  onboardForm.reset();
  nameField.classList.remove("is-invalid");
  nameError.textContent = "";
  syncActiveThemeOption(onboardForm, "light");
});

/* ============================================================================
   Boot: figure out which screen we're actually on and fill it in
   ----------------------------------------------------------------------------
   The <head> script already decided, before paint, whether this is an
   onboarding visit or a returning one (via data-screen on <html>). This is
   where that decision is turned into visible content.
   ============================================================================ */

(function boot() {
  const existingProfile = readProfile();

  if (!existingProfile) {
    syncActiveThemeOption(onboardForm, "light");
    return;
  }

  // Keep a copy of the previous lastSeen before overwriting it, so the
  // dashboard can say "you were last here X ago" instead of "just now"
  // on every single load.
  const previousLastSeen = existingProfile.lastSeen;
  const updatedProfile = {
    ...existingProfile,
    visits: (existingProfile.visits || 1) + 1,
    lastSeen: new Date().toISOString(),
    previousLastSeen,
  };

  writeProfile(updatedProfile);
  renderDashboard(updatedProfile);
})();