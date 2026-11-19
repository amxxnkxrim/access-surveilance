document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const serviceSlider = document.querySelector(".service-slider");
  const feedbackForm = document.querySelector(".feedback-form");

  if (feedbackForm) {
    const feedbackStatus = feedbackForm.querySelector(".feedback-status");
    feedbackForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const feedbackData = new FormData(feedbackForm);
      const category = String(feedbackData.get("category") || "General feedback");
      const rating = String(feedbackData.get("rating") || "Not provided");
      const name = String(feedbackData.get("name") || "Not provided");
      const email = String(feedbackData.get("email") || "Not provided");
      const message = String(feedbackData.get("feedback") || "").trim();
      const subject = "Customer feedback: " + category;
      const body = [
        "Category: " + category,
        "Rating: " + rating,
        "Name: " + name,
        "Email: " + email,
        "",
        "Feedback:",
        message
      ].join("\r\n");

      feedbackStatus.textContent = "Your email app should open with your feedback ready. Review it and press Send to submit.";
      window.location.href = "mailto:rehan@access-surveilance.co.za?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  const chatLauncher = document.createElement("button");
  chatLauncher.className = "faq-chat-launcher";
  chatLauncher.type = "button";
  chatLauncher.setAttribute("aria-expanded", "false");
  chatLauncher.setAttribute("aria-controls", "faq-chat-panel");
  chatLauncher.setAttribute("aria-label", "Open website chatbot");
  chatLauncher.title = "Open chatbot";
  chatLauncher.innerHTML = '<svg viewBox="0 0 512 512" aria-hidden="true"><circle cx="256" cy="68" r="38"></circle><rect x="246" y="106" width="20" height="82" rx="10"></rect><rect x="220" y="172" width="72" height="38" rx="19"></rect><rect x="67" y="228" width="378" height="186" rx="93"></rect><path d="M151 180c28-31 65-46 105-46 40 0 77 15 105 46" fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round"></path><circle cx="206" cy="310" r="24" fill="#fff" stroke="none"></circle><circle cx="306" cy="310" r="24" fill="#fff" stroke="none"></circle><path d="M219 363c8 31 66 31 74 0Z" fill="#fff" stroke="none"></path><rect x="37" y="250" width="82" height="142" rx="41"></rect><rect x="393" y="250" width="82" height="142" rx="41"></rect><circle cx="256" cy="432" r="54"></circle></svg>';

  const chatPanel = document.createElement("section");
  chatPanel.className = "faq-chat-panel";
  chatPanel.id = "faq-chat-panel";
  chatPanel.setAttribute("aria-label", "Access Surveillance website chatbot");
  chatPanel.hidden = true;
  chatPanel.innerHTML = [
    '<div class="faq-chat-header">',
    '  <span class="faq-chat-avatar" aria-hidden="true"><svg viewBox="0 0 512 512"><circle cx="256" cy="68" r="38"></circle><rect x="246" y="106" width="20" height="82" rx="10"></rect><rect x="220" y="172" width="72" height="38" rx="19"></rect><rect x="67" y="228" width="378" height="186" rx="93"></rect><path d="M151 180c28-31 65-46 105-46 40 0 77 15 105 46" fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round"></path><circle cx="206" cy="310" r="24" fill="#163f2f" stroke="none"></circle><circle cx="306" cy="310" r="24" fill="#163f2f" stroke="none"></circle><path d="M219 363c8 31 66 31 74 0Z" fill="#163f2f" stroke="none"></path><rect x="37" y="250" width="82" height="142" rx="41"></rect><rect x="393" y="250" width="82" height="142" rx="41"></rect><circle cx="256" cy="432" r="54"></circle></svg></span>',
    '  <div class="faq-chat-title"><strong>Website chatbot</strong><span class="faq-chat-status">Searching this website...</span></div>',
    '  <button class="faq-chat-close" type="button" aria-label="Close chat">&times;</button>',
    '</div>',
    '<div class="faq-chat-messages" role="log" aria-live="polite" aria-relevant="additions"></div>',
    '<div class="faq-chat-suggestions" aria-label="Suggested questions">',
    '  <button type="button">What services do you offer?</button>',
    '  <button type="button">Do you install CCTV cameras?</button>',
    '  <button type="button">What is access control?</button>',
    '  <button type="button">Do you automate gates and garages?</button>',
    '  <button type="button">Do you install electric fencing?</button>',
    '  <button type="button">Do you offer Ajax alarm systems?</button>',
    '  <button type="button">Do you do maintenance and repairs?</button>',
    '  <button type="button">How do I get a quote?</button>',
    '  <button type="button">Where do you provide service?</button>',
    '  <button type="button">How can I contact you?</button>',
    '  <button type="button" data-chat-navigation="feedback.html">Share feedback</button>',
    '</div>',
    '<form class="faq-chat-form">',
    '  <label class="faq-chat-label" for="faq-chat-input">Your question</label>',
    '  <input id="faq-chat-input" name="question" type="text" placeholder="Ask a question about our website..." autocomplete="off" required>',
    '  <button type="submit">Send</button>',
    '</form>'
  ].join("");

  document.body.append(chatLauncher, chatPanel);

  const chatMessages = chatPanel.querySelector(".faq-chat-messages");
  const chatInput = chatPanel.querySelector("#faq-chat-input");
  const chatStatus = chatPanel.querySelector(".faq-chat-status");
  const websiteContent = [];
  const stopWords = new Set([
    "a", "about", "am", "an", "and", "are", "as", "at", "be", "can", "do", "does", "for", "from",
    "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "our", "please", "tell", "that",
    "the", "this", "to", "us", "we", "what", "when", "where", "which", "who", "why", "with",
    "you", "your", "after", "before", "during", "happen", "happens"
  ]);
  const synonyms = {
    area: ["location", "coverage"],
    automate: ["automation"],
    camera: ["cctv", "surveillance"],
    cost: ["quote", "price", "pricing"],
    estimate: ["quote"],
    fix: ["repair", "maintenance"],
    location: ["area", "coverage"],
    price: ["quote", "cost", "pricing"],
    pricing: ["quote", "cost", "price"],
    repair: ["maintenance", "fix"],
    quote: ["estimate", "pricing"],
    step: ["process"],
    alarm: ["ajax"],
    ajax: ["alarm"],
    install: ["installation"],
    installation: ["install"]
  };

  const getSearchTokens = function (text) {
    return (text.toLowerCase().match(/[a-z0-9]+/g) || []).map(function (token) {
      if (token.length > 4 && token.endsWith("ies")) return token.slice(0, -3) + "y";
      if (token.length > 4 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
      return token;
    }).filter(function (token) {
      return token.length > 2 && !stopWords.has(token);
    });
  };

  const indexWebsitePage = function (html, fallbackTitle) {
    const pageDocument = new DOMParser().parseFromString(html, "text/html");
    const mainContent = pageDocument.querySelector("main") || pageDocument.body;
    const pageTitleElement = mainContent.querySelector("h1");
    const pageTitle = pageTitleElement ? pageTitleElement.textContent.trim() : fallbackTitle;
    const documentTitle = pageDocument.title || fallbackTitle;
    let sectionHeading = pageTitle;

    mainContent.querySelectorAll("article, h1, h2, h3, h4, p, li").forEach(function (element) {
      const rawText = element.textContent.replace(/\s+/g, " ").trim();
      const text = element.matches("article") ? rawText.replace(/^\d{1,2}\s+/, "") : rawText;
      if (!text) return;

      const isHeading = element.matches("h1, h2, h3, h4");
      const articleHeading = element.matches("article") ? element.querySelector("h1, h2, h3, h4") : null;
      if (isHeading) {
        sectionHeading = text;
      }

      const entryHeading = articleHeading ? articleHeading.textContent.replace(/\s+/g, " ").trim() : sectionHeading;
      const passage = element.matches("p, li") && sectionHeading !== text
        ? sectionHeading + ": " + text
        : text;
      if (passage.length > 12) {
        websiteContent.push({
          page: documentTitle.replace(/\s*[|—-]\s*Access Surveillance\s*$/i, ""),
          heading: isHeading ? text : entryHeading,
          isHeading: isHeading,
          text: passage,
          terms: new Set(getSearchTokens(passage)),
          headingTerms: new Set(getSearchTokens(isHeading ? text : entryHeading))
        });
      }
    });
  };

  let websiteContentPromise;
  const sitePages = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html", "feedback.html"];
  if (window.location.protocol === "file:") {
    indexWebsitePage(document.documentElement.outerHTML, document.title);
    chatStatus.textContent = "Local preview: current page only";
    websiteContentPromise = Promise.resolve();
  } else {
    const currentPagePath = new URL(window.location.href).pathname;
    let unavailablePages = 0;
    websiteContentPromise = Promise.all(sitePages.map(function (pagePath) {
      const pageUrl = new URL(pagePath, window.location.href);
      if (pageUrl.pathname === currentPagePath) {
        indexWebsitePage(document.documentElement.outerHTML, document.title);
        return Promise.resolve();
      }

      return window.fetch(pageUrl.href).then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
        return response.text();
      }).then(function (html) {
        indexWebsitePage(html, pagePath.replace(".html", ""));
      }).catch(function (error) {
        unavailablePages += 1;
        console.error("Could not index chatbot content from " + pageUrl.href, error);
      });
    })).then(function () {
      chatStatus.textContent = unavailablePages
        ? "Some website pages are unavailable"
        : "Answers from across this website";
    });
  }

  const addChatMessage = function (text, sender) {
    const message = document.createElement("p");
    message.className = "faq-chat-message faq-chat-message-" + sender;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const answerQuestion = function (question) {
    const normalizedQuestion = question.toLowerCase().replace(/\s+/g, " ").trim();
    if (/^(hi|hello|hey|good morning|good afternoon)\b/.test(normalizedQuestion)) {
      return "Hello! Ask me anything about the information on this website.";
    }
    if (/\b(feedback|review|suggestion)\b/.test(normalizedQuestion)) {
      return "You can share feedback on our Feedback page. Select “Share feedback” in this chat to open the form.";
    }

    const queryTerms = Array.from(new Set(getSearchTokens(question)));
    if (!queryTerms.length) {
      return "Please include a little more detail so I can search the website for you.";
    }

    const termWeights = new Map(queryTerms.map(function (term) {
      const alternatives = [term].concat(synonyms[term] || []);
      const documentFrequency = websiteContent.filter(function (entry) {
        return alternatives.some(function (alternative) {
          return entry.terms.has(alternative);
        });
      }).length;
      return [term, 1 + Math.log((websiteContent.length + 1) / (documentFrequency + 1))];
    }));

    const matches = websiteContent.map(function (entry) {
      let score = 0;
      queryTerms.forEach(function (term) {
        const alternatives = [term].concat(synonyms[term] || []);
        const matchIndex = alternatives.findIndex(function (alternative) {
          return entry.terms.has(alternative);
        });
        if (matchIndex === 0) score += (entry.headingTerms.has(term) ? 2 : 1) * termWeights.get(term);
        else if (matchIndex > 0) score += 0.7 * termWeights.get(term);
      });
      if (entry.isHeading) score -= 0.15;
      if (normalizedQuestion.length > 5 && entry.text.toLowerCase().includes(normalizedQuestion)) {
        score += 1;
      }
      return { entry: entry, score: score };
    }).filter(function (match) {
      return match.score > 0;
    }).sort(function (first, second) {
      return second.score - first.score;
    });

    const relevantMatches = [];
    const seenSections = new Set();
    for (let index = 0; index < matches.length && relevantMatches.length < 3; index += 1) {
      const match = matches[index];
      const sectionKey = match.entry.page + ":" + match.entry.heading;
      if (seenSections.has(sectionKey)) continue;
      if (relevantMatches.length && match.score < relevantMatches[0].score * 0.55) break;
      seenSections.add(sectionKey);
      relevantMatches.push(match.entry);
    }

    if (relevantMatches.length) {
      return relevantMatches.map(function (entry, index) {
        const detail = entry.text.length > 300 ? entry.text.slice(0, 297) + "..." : entry.text;
        return (index ? "" : "Here’s what I found on the website:\n\n") + detail + " (from " + entry.page + ")";
      }).join("\n\n");
    }

    return "I couldn’t find that information on the website. Try asking with different keywords, or contact us at rehan@access-surveilance.co.za or 078 137 6114.";
  };

  const askChatQuestion = function (question) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    addChatMessage(trimmedQuestion, "user");
    websiteContentPromise.then(function () {
      addChatMessage(answerQuestion(trimmedQuestion), "assistant");
    });
  };

  addChatMessage("Hi! Ask me a question about any information on our website, or choose a common question below.", "assistant");

  chatLauncher.addEventListener("click", function () {
    chatPanel.hidden = false;
    chatLauncher.setAttribute("aria-expanded", "true");
    chatInput.focus();
  });

  chatPanel.querySelector(".faq-chat-close").addEventListener("click", function () {
    chatPanel.hidden = true;
    chatLauncher.setAttribute("aria-expanded", "false");
    chatLauncher.focus();
  });

  chatPanel.querySelector(".faq-chat-form").addEventListener("submit", function (event) {
    event.preventDefault();
    askChatQuestion(chatInput.value);
    chatInput.value = "";
    chatInput.focus();
  });

  chatPanel.querySelector(".faq-chat-suggestions").addEventListener("click", function (event) {
    const suggestion = event.target.closest("button");
    if (!suggestion) return;
    if (suggestion.dataset.chatNavigation) {
      window.location.href = suggestion.dataset.chatNavigation;
      return;
    }
    askChatQuestion(suggestion.textContent);
    chatInput.focus();
  });

  chatPanel.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      chatPanel.hidden = true;
      chatLauncher.setAttribute("aria-expanded", "false");
      chatLauncher.focus();
    }
  });

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
