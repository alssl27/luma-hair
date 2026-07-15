"use strict";

const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const backToTop = document.querySelector("#back-to-top");

// Navigation and page polish
function closeMenu() {
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navMenu.classList.toggle("open", !isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  document.body.classList.toggle("menu-open", !isOpen);
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 700);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

// Announcement bar: cycles through short salon messages.
const announcementMessages = [
  "<u>New:</u> online video courses now available",
  "Complimentary consultation with every colour service",
  "Open Tuesday to Saturday &mdash; 24 Rose Lane, London"
];
const announceMessage = document.querySelector("#announce-message");
let announcementIndex = 0;

function showAnnouncement(step) {
  announcementIndex = (announcementIndex + step + announcementMessages.length) % announcementMessages.length;
  announceMessage.innerHTML = announcementMessages[announcementIndex];
}

document.querySelector("#announce-prev").addEventListener("click", () => showAnnouncement(-1));
document.querySelector("#announce-next").addEventListener("click", () => showAnnouncement(1));

// Reveal sections only when they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Highlights the navigation item for the section currently in view.
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      const target = link.getAttribute("href");
      link.classList.toggle("active", target === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

// Shared, accessible form validation helper.
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    const group = field.closest(".form-group");
    const message = group?.querySelector(".error-message");
    const isEmail = field.type === "email";
    const value = field.value.trim();
    let error = "";

    if (!value) {
      error = "This field is required.";
    } else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Enter a valid email address.";
    }

    group?.classList.toggle("has-error", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
    if (message) message.textContent = error;
    if (error) isValid = false;
  });

  return isValid;
}

document.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    const group = field.closest(".form-group");
    group?.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
    const message = group?.querySelector(".error-message");
    if (message) message.textContent = "";
  });
});

// Contact form demo: validates locally and provides clear feedback.
const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector("#contact-status");

  if (!validateForm(contactForm)) {
    status.textContent = "Please complete the highlighted fields.";
    return;
  }

  contactForm.reset();
  status.style.color = "#5d7d61";
  status.textContent = "Thank you. Your message has been received.";
});
