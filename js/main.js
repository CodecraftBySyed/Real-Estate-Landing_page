// main.js
// Theme toggle, testimonial slider, AOS init, and form validation

document.addEventListener("DOMContentLoaded", function () {
  // --- Theme Toggle ---
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const icon = document.getElementById("theme-icon");
  const darkClass = "dark";

  // Set theme from localStorage
  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    html.classList.add(darkClass);
  } else {
    html.classList.remove(darkClass);
  }

  function setThemeIcon(isDark) {
    if (isDark) {
      // Moon icon for dark mode
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
      `;
      icon.setAttribute("data-theme", "dark");
      icon.setAttribute("aria-label", "Switch to light mode");
    } else {
      // Sun icon for light mode
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.05 6.05L4.64 4.64m12.02 0l-1.41 1.41M6.05 17.95l-1.41 1.41" />
      `;
      icon.setAttribute("data-theme", "light");
      icon.setAttribute("aria-label", "Switch to dark mode");
    }
    themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  }

  function setTheme(dark) {
    html.classList.toggle(darkClass, dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    setThemeIcon(dark);
  }

  themeToggle.addEventListener("click", () => {
    const isDark = !html.classList.contains(darkClass);
    setTheme(isDark);
  });

  const userTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(userTheme === "dark" || (!userTheme && systemDark));

  // --- AOS Init ---
  // Ensure AOS is loaded before initializing
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-in-out",
    });
  } else {
    console.warn(
      "[AOS] AOS library not found. Ensure AOS is loaded before main.js."
    );
  }

  // --- Testimonial Slider ---
  const track = document.getElementById("testimonial-track");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");
  let current = 0;
  let slides = 0;

  if (track && prevBtn && nextBtn) {
    slides = track.children.length;
    function updateSlider() {
      track.style.transform = `translateX(-${current * 100}%)`;
    }
    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides) % slides;
      updateSlider();
    });
    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides;
      updateSlider();
    });
    // Optional: Auto-slide every 7s
    setInterval(() => {
      current = (current + 1) % slides;
      updateSlider();
    }, 7000);
  }

  // --- Contact Form Validation ---
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      let valid = true;
      // Name
      const name = form.name;
      const nameError = document.getElementById("name-error");
      if (!name.value.trim()) {
        nameError.classList.remove("hidden");
        valid = false;
      } else {
        nameError.classList.add("hidden");
      }
      // Email
      const email = form.email;
      const emailError = document.getElementById("email-error");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value)) {
        emailError.classList.remove("hidden");
        valid = false;
      } else {
        emailError.classList.add("hidden");
      }
      // Phone
      const phone = form.phone;
      const phoneError = document.getElementById("phone-error");
      if (!phone.value.trim()) {
        phoneError.classList.remove("hidden");
        valid = false;
      } else {
        phoneError.classList.add("hidden");
      }
      // Message
      const message = form.message;
      const messageError = document.getElementById("message-error");
      if (!message.value.trim()) {
        messageError.classList.remove("hidden");
        valid = false;
      } else {
        messageError.classList.add("hidden");
      }
      if (!valid) {
        e.preventDefault();
      }
    });
  }

  // --- Mobile Navbar Toggle ---
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("hidden");
      navMenu.classList.toggle("flex");
    });
    // Close menu on link click (mobile)
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          navMenu.classList.add("hidden");
          navMenu.classList.remove("flex");
        }
      });
    });
  }

  // --- Typing Animation for Hero Section (final robust fix) ---
  // Ensure this runs after DOMContentLoaded and after the elements exist in the DOM
  setTimeout(function () {
    const typedText = document.getElementById("typed-text");
    const cursor = document.getElementById("typed-cursor");
    const phrases = [
      "Find Your Dream Home",
      "Luxury Living Awaits",
      "Invest in Your Future",
      "Discover Exclusive Properties",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let typingTimeout, cursorInterval;

    function typePhrase() {
      if (!typedText || !cursor) return;
      typedText.textContent = phrases[phraseIndex].slice(0, charIndex);
      cursor.style.opacity = "1";
      if (charIndex < phrases[phraseIndex].length) {
        charIndex++;
        typingTimeout = setTimeout(typePhrase, 80);
      } else {
        typingTimeout = setTimeout(erasePhrase, 1500);
      }
    }

    function erasePhrase() {
      if (!typedText || !cursor) return;
      typedText.textContent = phrases[phraseIndex].slice(0, charIndex);
      if (charIndex > 0) {
        charIndex--;
        typingTimeout = setTimeout(erasePhrase, 40);
      } else {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingTimeout = setTimeout(typePhrase, 400);
      }
    }

    if (typedText && cursor) {
      if (window.__typingAnimationCleanup) window.__typingAnimationCleanup();
      charIndex = 0;
      typedText.textContent = "";
      typePhrase();
      cursorInterval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
      }, 500);
      window.__typingAnimationCleanup = () => {
        clearTimeout(typingTimeout);
        clearInterval(cursorInterval);
      };
    }
  }, 0); // Run after DOMContentLoaded and after all elements are present

  // Property Details Modal Logic
  (function () {
    const modal = document.getElementById("property-modal");
    const modalContent = modal.querySelector('div[role="dialog"]');
    const closeBtn = document.getElementById("modal-close");
    const contactBtn = document.getElementById("modal-contact");
    const img = document.getElementById("modal-img");
    const title = document.getElementById("modal-title");
    const price = document.getElementById("modal-price");
    const features = document.getElementById("modal-features");
    const description = document.getElementById("modal-description");
    let lastFocusedEl = null;

    // Helper: Trap focus inside modal
    function trapFocus(e) {
      const focusableEls = modalContent.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    }

    // Open modal and populate content
    function openModal(data) {
      lastFocusedEl = document.activeElement;
      img.src = data.img;
      img.alt = data.title + " image";
      title.textContent = data.title;
      price.textContent = data.price;
      // Features as list items
      features.innerHTML = "";
      data.features.split(",").forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f.trim();
        li.className = "bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded";
        features.appendChild(li);
      });
      description.textContent = data.description;
      // Ensure modal text and background are visible in both modes
      modalContent.classList.remove(
        "text-white",
        "text-gray-900",
        "bg-white",
        "bg-gray-900",
        "bg-gray-50"
      );
      description.classList.remove("text-gray-800", "text-gray-200");
      if (document.documentElement.classList.contains("dark")) {
        modalContent.classList.add("text-white", "bg-gray-900");
        description.classList.add("text-gray-200");
      } else {
        modalContent.classList.add("text-gray-900", "bg-gray-50");
        description.classList.add("text-gray-800");
      }
      modal.classList.remove("hidden");
      setTimeout(() => {
        modalContent.classList.remove(
          "scale-95",
          "opacity-0",
          "pointer-events-none"
        );
        modalContent.classList.add("scale-100", "opacity-100");
        closeBtn.focus();
      }, 10);
      document.body.classList.add("overflow-hidden");
      document.addEventListener("keydown", handleKeydown);
      modalContent.addEventListener("keydown", trapFocus);
    }

    function closeModal() {
      modalContent.classList.add(
        "scale-95",
        "opacity-0",
        "pointer-events-none"
      );
      setTimeout(() => {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        // Remove color classes to reset for next open
        modalContent.classList.remove(
          "text-white",
          "text-gray-900",
          "bg-white",
          "bg-gray-900",
          "bg-gray-50"
        );
        if (lastFocusedEl) lastFocusedEl.focus();
      }, 200);
      document.removeEventListener("keydown", handleKeydown);
      modalContent.removeEventListener("keydown", trapFocus);
    }

    // Handle ESC and overlay click
    function handleKeydown(e) {
      if (e.key === "Escape") closeModal();
    }
    modal.addEventListener("mousedown", function (e) {
      if (e.target === modal) closeModal();
    });
    closeBtn.addEventListener("click", closeModal);

    // Contact button (scroll to contact section)
    contactBtn.addEventListener("click", function () {
      closeModal();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Listen for all View Details buttons
    document.querySelectorAll(".view-details-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const data = {
          title: btn.getAttribute("data-title") || "",
          price: btn.getAttribute("data-price") || "",
          img: btn.getAttribute("data-img") || "",
          features: btn.getAttribute("data-features") || "",
          description: btn.getAttribute("data-description") || "",
        };
        openModal(data);
      });
    });
  })();
});
