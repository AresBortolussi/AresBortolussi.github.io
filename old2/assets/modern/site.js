"use strict";
const root = document.documentElement;
const theme = document.querySelector("#theme");
function setTheme(value) {
  root.dataset.theme = value;
  theme.setAttribute(
    "aria-label",
    value === "dark" ? "Attiva tema chiaro" : "Attiva tema scuro",
  );
  document.querySelector('meta[name="theme-color"]').content =
    value === "dark" ? "#111716" : "#f4f3ec";
}
let saved;
try {
  saved = localStorage.getItem("ab-theme");
} catch {
  /* Storage is optional. */
}
setTheme(saved === "light" ? "light" : "dark");
theme.hidden = false;
theme.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  try {
    localStorage.setItem("ab-theme", root.dataset.theme);
  } catch {
    /* Private browsing. */
  }
});
const filters = document.querySelector(".filters");
filters.hidden = false;
filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  for (const item of filters.querySelectorAll("button"))
    item.setAttribute("aria-pressed", String(item === button));
  let count = 0;
  for (const project of document.querySelectorAll("[data-category]")) {
    project.hidden =
      button.dataset.filter !== "all" &&
      !project.dataset.category.split(" ").includes(button.dataset.filter);
    if (!project.hidden) count++;
  }
  document.querySelector("#filter-status").textContent =
    `${count} progetti visualizzati`;
});
document.querySelector("#year").textContent = String(new Date().getFullYear());
