// ZAVN COUTURÉ — tiny JS for nav + mailto forms
const nav = document.getElementById("nav");
const toggle = document.querySelector(".nav__toggle");
const year = document.getElementById("year");

if (year) year.textContent = new Date().getFullYear();

function setExpanded(isOpen){
  toggle?.setAttribute("aria-expanded", String(isOpen));
  nav?.setAttribute("data-open", String(isOpen));
}

toggle?.addEventListener("click", () => {
  const isOpen = nav?.getAttribute("data-open") === "true";
  setExpanded(!isOpen);
});

nav?.addEventListener("click", (e) => {
  if (e.target && e.target.matches("a")) setExpanded(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setExpanded(false);
});

function mailtoFromForm(form, subject){
  const data = new FormData(form);
  const entries = Object.fromEntries(data.entries());
  const to = "hello@norova.host"; // <-- change this to your real business email

  const lines = Object.entries(entries)
    .filter(([,v]) => String(v).trim().length)
    .map(([k,v]) => `${k}: ${String(v).trim()}`);

  const body = encodeURIComponent(lines.join("\n"));
  const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${body}`;
  window.location.href = url;
}

function validate(form){
  // Basic HTML5 validation + a nicer nudge
  if (form.checkValidity()) return true;
  const firstInvalid = form.querySelector(":invalid");
  firstInvalid?.focus();
  return false;
}

document.getElementById("customForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validate(form)) return;
  mailtoFromForm(form, "ZAVN COUTURÉ — Custom Request");
  form.reset();
});

document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validate(form)) return;
  mailtoFromForm(form, "ZAVN COUTURÉ — Website Message");
  form.reset();
});

document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validate(form)) return;
  mailtoFromForm(form, "ZAVN COUTURÉ — Drop Alerts Signup");
  form.reset();
});
