/* ==========================================================================
   DevSummit '26 — Registration form validation
   ========================================================================== */

// ---- DOM references, grabbed once up front -------------------------------
const form = document.getElementById("regForm");
const formSummary = document.getElementById("formSummary");
const ticketView = document.getElementById("ticketView");
const editBtn = document.getElementById("editBtn");

const fields = {
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  organization: document.getElementById("organization"),
  role: document.getElementById("role"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  terms: document.getElementById("terms"),
};

// ---- Validation rules, one function per field -----------------------------
// Every rule returns an error string when the value is invalid, or an empty
// string when it passes. Keeping them in one object makes it trivial to see,
// at a glance, exactly what "valid" means for each field on this form.
const validators = {
  fullName: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Please enter your full name.";
    if (trimmed.length < 2) return "That name looks a little short.";
    return "";
  },

  email: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "An email address is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) return "Enter a valid email, like name@company.com.";
    return "";
  },

  phone: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "A phone number is required.";
    const digitsOnly = trimmed.replace(/[\s()+-]/g, "");
    if (!/^\d{7,15}$/.test(digitsOnly)) return "Enter a valid phone number (7–15 digits).";
    return "";
  },

  organization: (value) => {
    if (!value.trim()) return "Let us know where you work or study.";
    return "";
  },

  role: (value) => {
    if (!value) return "Select the option that best describes you.";
    return "";
  },

  password: (value) => {
    if (!value) return "Create a password for your attendee account.";
    if (value.length < 8) return "Use at least 8 characters.";
    return "";
  },

  confirmPassword: (value) => {
    if (!value) return "Please confirm your password.";
    if (value !== fields.password.value) return "Passwords don't match.";
    return "";
  },

  terms: (checked) => {
    if (!checked) return "You need to accept the terms to continue.";
    return "";
  },
};

// ---- Reading a field's current value in the right shape --------------------
function readValue(name) {
  const el = fields[name];
  return el.type === "checkbox" ? el.checked : el.value;
}

// ---- Applying / clearing the visual state for one field --------------------
function setFieldState(name, errorMessage) {
  const fieldEl = form.querySelector(`[data-field="${name}"]`);
  const errorEl = document.getElementById(`err-${name}`);
  const isValid = !errorMessage;

  fieldEl.classList.toggle("is-invalid", !isValid);
  fieldEl.classList.toggle("is-valid", isValid && readValue(name) !== "");
  errorEl.textContent = errorMessage || "";

  fields[name].setAttribute("aria-invalid", String(!isValid));

  updateChecklist(name, isValid);
  return isValid;
}

// ---- Validating a single field on demand ------------------------------------
function validateField(name) {
  const errorMessage = validators[name](readValue(name));
  return setFieldState(name, errorMessage);
}

// ---- The left-panel "boarding checklist" reacts live to validation ---------
function updateChecklist(name, isValid) {
  const item = document.querySelector(`.checklist__item[data-check="${name}"]`);
  if (!item) return;
  const hasValue = name === "terms" ? fields.terms.checked : readValue(name).toString().trim() !== "";
  item.classList.toggle("is-done", isValid && hasValue);
}

// ---- Wire up live validation: check as the user leaves a field, and
//      re-check as they type once an error is already showing (so the
//      message clears the moment they fix it, instead of lingering). -------
Object.keys(fields).forEach((name) => {
  const el = fields[name];
  const eventName = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";

  el.addEventListener("blur", () => validateField(name));

  el.addEventListener(eventName, () => {
    const fieldEl = form.querySelector(`[data-field="${name}"]`);
    if (fieldEl.classList.contains("is-invalid") || el.type === "checkbox" || el.tagName === "SELECT") {
      validateField(name);
    }
    // Re-check confirmPassword whenever password changes, since its
    // validity depends on a value that lives in a different field.
    if (name === "password" && form.querySelector('[data-field="confirmPassword"]').classList.contains("is-invalid")) {
      validateField("confirmPassword");
    }
  });
});

// ---- Submit: validate everything, refuse to proceed on empty/invalid data --
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const results = Object.keys(fields).map((name) => validateField(name));
  const allValid = results.every(Boolean);

  if (!allValid) {
    formSummary.textContent = "A few fields still need your attention before we can confirm your seat.";
    form.classList.remove("is-shaking");
    // Force reflow so the shake animation can re-trigger on repeated attempts.
    void form.offsetWidth;
    form.classList.add("is-shaking");

    const firstInvalid = form.querySelector(".is-invalid input, .is-invalid select");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  formSummary.textContent = "";
  showTicket();
});

// ---- Build and reveal the confirmation ticket once everything checks out ---
function showTicket() {
  const confirmationCode = "DS26-" + Math.floor(100000 + Math.random() * 900000);
  const roleLabels = {
    frontend: "Frontend Engineer",
    backend: "Backend Engineer",
    fullstack: "Full-Stack Engineer",
    student: "Student / Intern",
    other: "Other",
  };

  document.getElementById("ticketCode").textContent = confirmationCode;
  document.getElementById("ticketName").textContent = fields.fullName.value.trim();
  document.getElementById("ticketEmail").textContent = fields.email.value.trim();
  document.getElementById("ticketOrg").textContent = fields.organization.value.trim();
  document.getElementById("ticketRole").textContent = roleLabels[fields.role.value] || fields.role.value;

  form.hidden = true;
  ticketView.hidden = false;
  ticketView.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Let an attendee step back and edit their details -----------------------
editBtn.addEventListener("click", () => {
  ticketView.hidden = true;
  form.hidden = false;
});