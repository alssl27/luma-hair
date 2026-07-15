"use strict";

const CART_KEY = "lumaHouseCourseCart";

const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const backToTop = document.querySelector("#back-to-top");

// Navigation and page polish (shared with the home page).
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
  "Lifetime access with every course purchase",
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

// Course cart: stored in localStorage so it survives page reloads.
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartTotalValue = document.querySelector("#cart-total-value");
const cartCount = document.querySelector("#cart-count");
const cartStatus = document.querySelector("#cart-status");
const checkoutButton = document.querySelector("#checkout");

function loadCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* storage unavailable: cart lives for this page view only */
  }
}

function formatPrice(value) {
  return `£${value.toFixed(2)}`;
}

function renderCart(cart) {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartItems.innerHTML = cart
    .map((item, index) => `
      <li class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <span>${item.qty} &times; ${formatPrice(item.price)}</span>
        </div>
        <div class="cart-item-end">
          <strong>${formatPrice(item.price * item.qty)}</strong>
          <button class="text-link cart-remove" type="button" data-index="${index}">Remove</button>
        </div>
      </li>`)
    .join("");

  cartEmpty.hidden = cart.length > 0;
  cartTotal.hidden = cart.length === 0;
  cartTotalValue.textContent = formatPrice(total);
  checkoutButton.disabled = cart.length === 0;
  cartCount.hidden = count === 0;
  cartCount.textContent = String(count);

  cartItems.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", () => {
      const next = loadCart();
      next.splice(Number(button.dataset.index), 1);
      saveCart(next);
      renderCart(next);
      cartStatus.textContent = "";
    });
  });
}

function addToCart(id, name, price, qty = 1) {
  const cart = loadCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, qty });
  }
  saveCart(cart);
  renderCart(cart);
}

document.querySelectorAll(".course-add").forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.id, button.dataset.name, Number(button.dataset.price));
    const label = button.textContent;
    button.textContent = "Added";
    setTimeout(() => { button.textContent = label; }, 1200);
  });
});

// Featured course: deposit/full payment options plus a quantity stepper.
const featuredOptions = document.querySelector("#featured-options");
const featuredPrice = document.querySelector("#featured-price");
const featuredStatus = document.querySelector("#featured-status");
const qtyValue = document.querySelector("#qty-value");
let featuredAmount = 200;
let featuredQty = 1;

featuredOptions.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    featuredOptions.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    featuredAmount = Number(pill.dataset.price);
    featuredPrice.textContent = formatPrice(featuredAmount);
  });
});

document.querySelector("#qty-minus").addEventListener("click", () => {
  featuredQty = Math.max(1, featuredQty - 1);
  qtyValue.textContent = String(featuredQty);
});

document.querySelector("#qty-plus").addEventListener("click", () => {
  featuredQty = Math.min(9, featuredQty + 1);
  qtyValue.textContent = String(featuredQty);
});

function addFeaturedToCart() {
  const isDeposit = featuredAmount === 200;
  addToCart(
    isDeposit ? "masterclass-deposit" : "masterclass-full",
    `Advanced Balayage Masterclass (${isDeposit ? "deposit" : "full payment"})`,
    featuredAmount,
    featuredQty
  );
}

document.querySelector("#featured-add").addEventListener("click", () => {
  addFeaturedToCart();
  featuredStatus.textContent = "Added to your cart.";
  setTimeout(() => { featuredStatus.textContent = ""; }, 1600);
});

document.querySelector("#featured-buy").addEventListener("click", () => {
  addFeaturedToCart();
});

checkoutButton.addEventListener("click", () => {
  saveCart([]);
  renderCart([]);
  cartStatus.textContent = "Thank you! This demo checkout is complete - your course access email would arrive shortly.";
});

renderCart(loadCart());
