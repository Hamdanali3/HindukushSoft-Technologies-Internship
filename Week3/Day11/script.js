/* ============================================================
   Week 3 · Day 11 — JavaScript Basics
   Task: Log your name, age, and country to the console.
   Topics covered: variables, data types, console.log()
   Author: Hamdan Ali
   ============================================================ */

// --- Variables ---
// `const` is used here because these values don't need to change
// after they're set. If a value were expected to change later
// (like a counter or a running total), `let` would be the better choice.

const name = "Hamdan Ali";       // string
const age = 21;                  // number
const country = "Pakistan";      // string
const isStudent = true;          // boolean

// --- Logging individual values ---
console.log("Name:", name);
console.log("Age:", age);
console.log("Country:", country);

// --- A cleaner, combined log using a template literal ---
// Template literals (the backtick strings below) let us drop
// variables directly into a sentence instead of stitching
// strings together with the + operator.
console.log(`Hi, I'm ${name}, ${age} years old, from ${country}.`);

// --- A quick look at data types ---
// `typeof` is a handy operator for checking what kind of value
// you're actually working with — useful for debugging.
console.log("---- Data type check ----");
console.log(`typeof name:      ${typeof name}`);
console.log(`typeof age:       ${typeof age}`);
console.log(`typeof country:   ${typeof country}`);
console.log(`typeof isStudent: ${typeof isStudent}`);

// --- Grouping related data in an object ---
// Objects are useful once you have several related values —
// instead of five separate variables, they live together
// under one name (`profile`), which keeps the code organized.
const profile = {
  name: name,
  age: age,
  country: country,
  isStudent: isStudent,
};

console.log("---- Profile object ----");
console.log(profile);
