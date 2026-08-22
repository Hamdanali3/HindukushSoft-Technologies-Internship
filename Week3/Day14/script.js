/* ============================================================
   Week 3 · Day 14 — Arrays & Loops (for, while)
   Task: Create a shopping list array and display all items
         using a loop — now fully editable by the user.
   Topics covered: arrays, for loop, while loop, DOM events
   Author: Hamdan Ali
   ============================================================ */

const STORAGE_KEY = "hamdan-shopping-ledger";

// ---- The shopping list array ----
// Still one array of objects — the difference from the first version
// is that every field here can now be changed from the page itself,
// and the array is treated as the single source of truth: whenever
// it changes, the page just re-reads it and redraws.
let shoppingList = loadFromStorage() || [
  { id: 1, item: "Basmati Rice", quantity: 2, unit: "kg", price: 380 },
  { id: 2, item: "Cooking Oil", quantity: 1, unit: "liter", price: 650 },
  { id: 3, item: "Red Lentils (Masoor Daal)", quantity: 1, unit: "kg", price: 320 },
  { id: 4, item: "Chicken", quantity: 1.5, unit: "kg", price: 950 },
  { id: 5, item: "Tomatoes", quantity: 2, unit: "kg", price: 240 },
  { id: 6, item: "Onions", quantity: 3, unit: "kg", price: 270 },
  { id: 7, item: "Milk", quantity: 2, unit: "liter", price: 340 },
  { id: 8, item: "Tea Leaves", quantity: 1, unit: "pack", price: 410 },
];

let nextId = shoppingList.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;

// ---- Element references ----
const ledgerBody = document.getElementById("ledger-body");
const addItemBtn = document.getElementById("add-item-btn");
const totalOutput = document.getElementById("total-output");
const itemCountOutput = document.getElementById("item-count-output");
const avgOutput = document.getElementById("avg-output");
const emptyState = document.getElementById("empty-state");

/**
 * Renders every item in shoppingList onto the page using a
 * classic for loop — we know exactly how many rows to build
 * (one per array entry) and the index doubles as the line number.
 */
function renderLedger() {
  ledgerBody.innerHTML = "";

  for (let i = 0; i < shoppingList.length; i++) {
    const entry = shoppingList[i];
    ledgerBody.appendChild(buildRow(entry, i + 1));
  }

  emptyState.hidden = shoppingList.length !== 0;
  updateSummary();
  saveToStorage();
}

/**
 * Builds one editable <tr> for a single shopping list entry.
 * Every field (name, quantity, unit, price) is a live input,
 * so the user can change any of it directly on the page.
 */
function buildRow(entry, lineNumber) {
  const row = document.createElement("tr");
  row.className = "ledger-row";
  row.dataset.id = entry.id;

  row.innerHTML = `
    <td class="col-line">${lineNumber}</td>
    <td class="col-item">
      <input type="text" class="field field-item" value="${escapeHtml(entry.item)}" placeholder="Item name" aria-label="Item name">
    </td>
    <td class="col-qty">
      <input type="number" class="field field-qty" value="${entry.quantity}" min="0" step="0.5" aria-label="Quantity">
      <input type="text" class="field field-unit" value="${escapeHtml(entry.unit)}" placeholder="unit" aria-label="Unit">
    </td>
    <td class="col-price">
      <span class="rs">Rs.</span>
      <input type="number" class="field field-price" value="${entry.price}" min="0" step="10" aria-label="Price per unit">
    </td>
    <td class="col-linetotal">Rs. ${(entry.quantity * entry.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
    <td class="col-remove">
      <button type="button" class="remove-btn" title="Remove item" aria-label="Remove ${escapeHtml(entry.item)}">&times;</button>
    </td>
  `;

  // Each field updates the underlying array directly on input,
  // then only refreshes the summary + this row's line total —
  // NOT the whole table — so the user never loses focus mid-type.
  row.querySelector(".field-item").addEventListener("input", (e) => {
    updateEntry(entry.id, { item: e.target.value });
  });
  row.querySelector(".field-qty").addEventListener("input", (e) => {
    updateEntry(entry.id, { quantity: parseFloat(e.target.value) || 0 });
    refreshRowTotal(row, entry.id);
  });
  row.querySelector(".field-unit").addEventListener("input", (e) => {
    updateEntry(entry.id, { unit: e.target.value });
  });
  row.querySelector(".field-price").addEventListener("input", (e) => {
    updateEntry(entry.id, { price: parseFloat(e.target.value) || 0 });
    refreshRowTotal(row, entry.id);
  });
  row.querySelector(".remove-btn").addEventListener("click", () => removeEntry(entry.id));

  return row;
}

/** Finds an entry by id and merges in the changed fields. */
function updateEntry(id, changes) {
  const entry = shoppingList.find((e) => e.id === id);
  if (!entry) return;
  Object.assign(entry, changes);
  updateSummary();
  saveToStorage();
}

/** Recomputes just one row's line-total cell, without a full re-render. */
function refreshRowTotal(row, id) {
  const entry = shoppingList.find((e) => e.id === id);
  const cell = row.querySelector(".col-linetotal");
  cell.textContent = `Rs. ${(entry.quantity * entry.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/** Adds a fresh, blank row to the ledger and focuses its name field. */
function addEntry() {
  const newEntry = { id: nextId++, item: "", quantity: 1, unit: "unit", price: 0 };
  shoppingList.push(newEntry);
  renderLedger();

  const newRow = ledgerBody.querySelector(`tr[data-id="${newEntry.id}"]`);
  if (newRow) newRow.querySelector(".field-item").focus();
}

/** Removes an entry by id and redraws the ledger. */
function removeEntry(id) {
  shoppingList = shoppingList.filter((e) => e.id !== id);
  renderLedger();
}

/**
 * Calculates the total cost of the shopping list using a while
 * loop — a second loop style doing genuinely different work
 * from the for loop that renders the table above.
 */
function calculateTotalWithWhileLoop() {
  let total = 0;
  let index = 0;

  while (index < shoppingList.length) {
    total += shoppingList[index].quantity * shoppingList[index].price;
    index++; // without this the loop never ends
  }

  return total;
}

/** Refreshes the receipt-tape summary panel (total, count, average). */
function updateSummary() {
  const total = calculateTotalWithWhileLoop();
  const count = shoppingList.length;
  const average = count === 0 ? 0 : total / count;

  totalOutput.textContent = `Rs. ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  itemCountOutput.textContent = count;
  avgOutput.textContent = `Rs. ${average.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/** Basic HTML-escaping so typed item names can't break the markup. */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Persistence: keeps edits after a page refresh ----
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingList));
  } catch (err) {
    console.warn("Could not save shopping list to localStorage.", err);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Could not load shopping list from localStorage.", err);
    return null;
  }
}

// ---- Wiring ----
addItemBtn.addEventListener("click", addEntry);

document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

renderLedger();
