// 1. The Toggle Function
function toggleDarkMode() {
  const htmlEl = document.documentElement;

  // Toggle the class
  htmlEl.classList.toggle("dark");

  // Save the preference based on the CURRENT state of the class
  if (htmlEl.classList.contains("dark")) {
    localStorage.theme = "dark";
  } else {
    localStorage.theme = "light";
  }
}

// 2. Optional: Button to reset to "System" (Clear memory)
// If you want a button that says "Use System Theme", use this:
function resetToSystem() {
  localStorage.removeItem("theme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
// harmburge logic

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenu = document.getElementById("close-menu");
  const sidebar = mobileMenu.querySelector("div");
  let focusedElementBeforeOpen;

  const focusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let firstFocusable;
  let lastFocusable;

  function openMenu() {
    focusedElementBeforeOpen = document.activeElement;
    mobileMenu.classList.remove("hidden");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      sidebar.classList.remove("translate-x-full");
    }, 10);
    menuToggle.setAttribute("aria-expanded", "true");
    const focusableElements = sidebar.querySelectorAll(focusableSelector);
    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];
    closeMenu.focus();
    mobileMenu.addEventListener("keydown", trapFocus);
  }

  function closeMenuFunc(restoreFocus = true, targetId = null) {
    sidebar.classList.add("translate-x-full");
    menuToggle.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (restoreFocus) {
        focusedElementBeforeOpen.focus();
      }
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
          // Focus the target for accessibility (add tabindex="-1" to your sections if needed)
          targetElement.focus({ preventScroll: true });
        }
      }
    }, 300);
    mobileMenu.removeEventListener("keydown", trapFocus);
  }

  function trapFocus(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  menuToggle.addEventListener("click", openMenu);
  closeMenu.addEventListener("click", () => closeMenuFunc(true));
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMenuFunc(true);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
      closeMenuFunc(true);
    }
  });

  // Add auto-close and scroll handling for menu links
  const menuLinks = sidebar.querySelectorAll('a[href^="#"]');
  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      closeMenuFunc(false, targetId);
    });
  });
});

// scroll to top button
const scrollBtn = document.getElementById("scrollToTopBtn");

// Show/Hide button based on scroll position
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    // Show button
    scrollBtn.classList.remove(
      "translate-y-10",
      "opacity-0",
      "pointer-events-none"
    );
    scrollBtn.classList.add(
      "translate-y-0",
      "opacity-100",
      "pointer-events-auto"
    );
  } else {
    // Hide button
    scrollBtn.classList.add(
      "translate-y-10",
      "opacity-0",
      "pointer-events-none"
    );
    scrollBtn.classList.remove(
      "translate-y-0",
      "opacity-100",
      "pointer-events-auto"
    );
  }
});

// Smooth scroll to top functionality
scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// image loading
document.querySelectorAll(".parallax-layer").forEach((layer) => {
  const largeSrc = layer.dataset.bgLarge;

  // 1. Ensure the element is an <img> tag before proceeding (for safety)
  if (!largeSrc || layer.tagName !== "IMG") return;

  // 2. Create a temporary Image object to handle pre-loading
  const newImg = new Image();
  newImg.src = largeSrc;

  // 3. Once the high-res image is fully loaded
  newImg.onload = () => {
    // THE FIX: Set the new image URL to the <img> element's src attribute
    layer.src = largeSrc;

    // Tailwind class swap (removes all blur/scale classes)
    layer.classList.remove("blur-xl", "blur-2xl", "scale-105");
    layer.classList.add("blur-0", "scale-100");
  };
});
// prefetching the thank_you.html
// Function to handle the prefetch
function prefetchThankYouPage() {
  const head = document.head;
  const url = "https://getform.io/thank-you?id=awnvnjgb";

  // Check if the link is already prefetched to avoid duplicates
  if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
    return;
  }

  // Create and inject the prefetch link
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  link.as = "document"; // Hint to the browser that this is an HTML page
  head.appendChild(link);

  // OPTIONAL: Remove the listener after the first interaction
  // This ensures the prefetch only happens once per page load.
  const form = document.getElementById("contact-form");
  if (form) {
    form.removeEventListener("focusin", prefetchThankYouPage);
  }
}

// Find the form and attach the event listener
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (form) {
    // We use the 'focusin' event on the form container.
    // This event bubbles up, so it triggers when *any* input inside the form
    // (text fields, textarea, etc.) receives focus (by clicking or tabbing).
    form.addEventListener("focusin", prefetchThankYouPage, { once: true });
  }
});
