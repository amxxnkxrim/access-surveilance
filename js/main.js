document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const serviceSlider = document.querySelector(".service-slider");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    mainNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  const cursorMedia = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

  if (cursorMedia.matches) {
    const trailCanvas = document.createElement("canvas");
    const trailContext = trailCanvas.getContext("2d");
    if (trailContext) {
      const cursorDot = document.createElement("div");
      cursorDot.className = "custom-cursor-dot";
      cursorDot.setAttribute("aria-hidden", "true");
      trailCanvas.className = "custom-cursor-trail";
      trailCanvas.setAttribute("aria-hidden", "true");
      document.body.append(trailCanvas, cursorDot);
      document.body.classList.add("fancy-cursor-enabled");

      const trail = [];
      const trailLifetime = 520;
      const maxTrailDots = 48;
      let pointerX = 0;
      let pointerY = 0;
      let previousX = 0;
      let previousY = 0;
      let animationFrame = 0;
      let hasPointer = false;
      let pixelRatio = 1;

      const resizeTrail = function () {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        trailCanvas.width = Math.round(window.innerWidth * pixelRatio);
        trailCanvas.height = Math.round(window.innerHeight * pixelRatio);
        trailCanvas.style.width = window.innerWidth + "px";
        trailCanvas.style.height = window.innerHeight + "px";
        trailContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      };

      const drawTrail = function (now) {
        trailContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let index = trail.length - 1; index >= 0; index -= 1) {
          const dot = trail[index];
          const progress = (now - dot.createdAt) / trailLifetime;
          if (progress >= 1) {
            trail.splice(index, 1);
            continue;
          }

          const radius = 5 * (1 - progress);
          trailContext.beginPath();
          trailContext.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
          trailContext.fillStyle = "rgba(185, 31, 38, " + (1 - progress) + ")";
          trailContext.fill();
        }

        if (trail.length) {
          animationFrame = window.requestAnimationFrame(drawTrail);
        } else {
          animationFrame = 0;
        }
      };

      window.addEventListener("resize", resizeTrail);
      resizeTrail();

      window.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        cursorDot.style.left = pointerX + "px";
        cursorDot.style.top = pointerY + "px";
        cursorDot.classList.add("is-visible");

        const distance = Math.hypot(pointerX - previousX, pointerY - previousY);
        if (!hasPointer || distance >= 10) {
          trail.push({ x: pointerX, y: pointerY, createdAt: performance.now() });
          if (trail.length > maxTrailDots) trail.shift();
          previousX = pointerX;
          previousY = pointerY;
          hasPointer = true;
          if (!animationFrame) animationFrame = window.requestAnimationFrame(drawTrail);
        }
      });

      window.addEventListener("pointerdown", function () {
        cursorDot.classList.add("is-pressed");
      });

      window.addEventListener("pointerup", function () {
        cursorDot.classList.remove("is-pressed");
      });

      document.documentElement.addEventListener("pointerleave", function () {
        cursorDot.classList.remove("is-visible", "is-pressed");
        hasPointer = false;
      });
    }
  }

  const styledHeadings = document.querySelectorAll(
    ".section-heading h2, .trust-copy-wrap h2, .info-card h2, .detail-card h3, .quote-panel h3, .page-hero-copy h1, .cta-card h2"
  );

  styledHeadings.forEach(function (heading) {
    if (heading.querySelector(".word-green, .word-red") || heading.innerText.trim() === "") {
      return;
    }

    const words = heading.textContent.trim().split(/\s+/);
    if (words.length < 2) {
      return;
    }

    const first = document.createElement("span");
    first.className = "word-green";
    first.textContent = words[0];

    const last = document.createElement("span");
    last.className = "word-red";
    last.textContent = words[words.length - 1];

    const middle = words.slice(1, -1).join(" ");
    heading.innerHTML = "";
    heading.appendChild(first);
    heading.appendChild(document.createTextNode(middle ? " " + middle + " " : " "));
    heading.appendChild(last);
  });

  const revealItems = document.querySelectorAll(
    ".site-header, .page-hero, .page-hero-copy, .info-card, .feature-card, .section-heading, .process-step, .stat-card, .service-card-page, .detail-card, .quote-panel, .contact-form-wrap, .cta-card, .hero-copy, .hero-panel, .service-card, .trust-copy-wrap, .trust-point, .trust-panel-card, .about-services-intro, .about-service-item, .about-approach-statement, .about-approach-copy, .about-why-item, .footer-grid"
  );

  const groupedRevealItems = new Set(
    document.querySelectorAll(
      ".feature-card, .process-step, .stat-card, .service-card-page, .detail-card, .service-card, .trust-point, .about-service-item, .about-why-item"
    )
  );
  const revealMotionByGroup = ["reveal--tilt-left", "reveal--right", "reveal--tilt-right", "reveal--zoom", "reveal--left"];
  const revealCounts = new Map();
  const motionClassFor = function (item) {
    if (item.matches(".section-heading")) return "reveal--fade";
    if (item.matches(".page-hero")) return "reveal--wipe";
    if (item.matches(".hero-panel, .trust-panel-card, .about-approach-statement, .quote-panel, .info-card")) return "reveal--zoom";
    if (item.matches(".hero-copy, .page-hero-copy, .trust-copy-wrap, .about-services-intro")) return "reveal--left";
    if (item.matches(".about-approach-copy, .contact-form-wrap, .cta-card, .footer-grid")) return "reveal--right";
    if (groupedRevealItems.has(item)) {
      const parent = item.parentElement;
      const index = revealCounts.get(parent) || 0;
      revealCounts.set(parent, index + 1);
      return revealMotionByGroup[index % revealMotionByGroup.length];
    }
    return "reveal";
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach(function (item) {
      const parent = item.parentElement;
      const index = revealCounts.get(parent) || 0;
      if (!groupedRevealItems.has(item)) {
        revealCounts.set(parent, index + 1);
      }
      item.style.setProperty("--reveal-delay", Math.min(index * 70, 280) + "ms");
      item.classList.add("reveal");
      item.classList.add(motionClassFor(item));
      observer.observe(item);
    });
  }

  if (serviceSlider) {
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let hoverTimer = null;
    const hoverDelay = 500;

    const enableHoverInteraction = () => {
      serviceSlider.classList.add("interactive");
    };

    const disableHoverInteraction = () => {
      serviceSlider.classList.remove("interactive");
      isDown = false;
      clearTimeout(hoverTimer);
    };

    serviceSlider.addEventListener("pointerenter", function () {
      hoverTimer = setTimeout(enableHoverInteraction, hoverDelay);
    });

    serviceSlider.addEventListener("pointerleave", function () {
      disableHoverInteraction();
    });

    serviceSlider.addEventListener("wheel", function (event) {
      if (!serviceSlider.classList.contains("interactive")) {
        return;
      }
      event.preventDefault();
      serviceSlider.scrollLeft += event.deltaY;
    }, { passive: false });

    serviceSlider.addEventListener("pointerdown", function (event) {
      if (!serviceSlider.classList.contains("interactive")) {
        return;
      }
      isDown = true;
      startX = event.clientX;
      startScrollLeft = serviceSlider.scrollLeft;
      serviceSlider.setPointerCapture(event.pointerId);
    });

    serviceSlider.addEventListener("pointermove", function (event) {
      if (!isDown || !serviceSlider.classList.contains("interactive")) return;
      event.preventDefault();
      const walk = (event.clientX - startX) * 1.2;
      serviceSlider.scrollLeft = startScrollLeft - walk;
    });

    serviceSlider.addEventListener("pointerup", function () {
      isDown = false;
    });

    serviceSlider.addEventListener("pointercancel", function () {
      isDown = false;
    });
  }

});
