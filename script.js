// Example JavaScript function (can be adapted for frameworks)
function toggleDarkMode() {
  const htmlEl = document.documentElement;
  htmlEl.classList.toggle("dark");
  // Optional: Save preference to localStorage
  localStorage.theme = htmlEl.classList.contains("dark") ? "dark" : "light";
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
