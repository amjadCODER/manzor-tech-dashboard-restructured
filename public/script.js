const modalButtons = document.querySelectorAll("[data-modal]");
const modalCloseButtons = document.querySelectorAll(".modal .close");
const dialogs = document.querySelectorAll("dialog");

modalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.getElementById(button.dataset.modal);
    modal?.showModal();
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("dialog")?.close();
  });
});

dialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) dialog.close();
  });
});

const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "عرض صورة النظام");
lightbox.innerHTML = `
  <button type="button" aria-label="اغلاق الصورة">×</button>
  <img alt="صورة النظام بالحجم الكامل">
  <div class="mockup-preview"></div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector("img");
const lightboxCloseButton = lightbox.querySelector("button");
const mockupPreview = lightbox.querySelector(".mockup-preview");

function closeLightbox() {
  lightbox.classList.remove("open", "mockup-mode");
  document.body.classList.remove("lightbox-open");
  lightboxImage?.removeAttribute("src");
  if (mockupPreview) mockupPreview.innerHTML = "";
}

function openImagePreview(image) {
  if (!lightboxImage) return;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "صورة النظام";
  lightbox.classList.add("open");
  document.body.classList.add("lightbox-open");
}

function openMockupPreview(mockup) {
  if (!mockupPreview) return;

  mockupPreview.innerHTML = "";
  const clone = mockup.cloneNode(true);
  clone.classList.remove("zoomable-mockup");
  clone.removeAttribute("role");
  clone.removeAttribute("tabindex");
  clone.removeAttribute("aria-label");
  mockupPreview.appendChild(clone);

  lightbox.classList.add("mockup-mode", "open");
  document.body.classList.add("lightbox-open");
}

document.querySelectorAll(".system-gallery img").forEach((image) => {
  image.addEventListener("click", (event) => {
    event.stopPropagation();
    openImagePreview(image);
  });
});

document.querySelectorAll(".zoomable-mockup").forEach((mockup) => {
  mockup.addEventListener("click", (event) => {
    if (event.target.closest(".details-btn")) return;
    event.stopPropagation();
    openMockupPreview(mockup);
  });

  mockup.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openMockupPreview(mockup);
  });
});

lightboxCloseButton?.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

const searchInput = document.getElementById("system-search");
const resultsBox = document.getElementById("search-results");
const systemCards = [...document.querySelectorAll(".system-card")];
const systems = systemCards.map((card) => ({
  card,
  name: card.querySelector("h3")?.textContent?.trim() || "",
  keywords: (card.dataset.search || "").toLowerCase(),
}));

function runSearch() {
  if (!searchInput || !resultsBox) return;

  const query = searchInput.value.trim().toLowerCase();
  resultsBox.innerHTML = "";
  systemCards.forEach((card) => card.classList.remove("search-hidden"));

  if (!query) {
    resultsBox.classList.remove("open");
    return;
  }

  const matches = systems.filter(
    ({ name, keywords }) => name.toLowerCase().includes(query) || keywords.includes(query),
  );

  matches.forEach(({ card, name }) => {
    const resultButton = document.createElement("button");
    resultButton.type = "button";
    resultButton.textContent = name;
    resultButton.addEventListener("click", () => {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      searchInput.value = "";
      resultsBox.classList.remove("open");
    });
    resultsBox.appendChild(resultButton);
  });

  resultsBox.classList.toggle("open", matches.length > 0);
}

searchInput?.addEventListener("input", runSearch);
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-search")) {
    resultsBox?.classList.remove("open");
  }
});

document.querySelector(".search-toggle")?.addEventListener("click", () => {
  document.querySelector(".header-search")?.classList.toggle("open");
  window.setTimeout(() => searchInput?.focus(), 50);
});

function startHeroTyping() {
  const title = document.getElementById("typing-title");
  if (!title) return;

  const fullText = title.dataset.text || title.textContent?.trim() || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !fullText) {
    title.textContent = fullText;
    return;
  }

  title.textContent = "";
  title.classList.add("typing-active");

  let index = 0;
  const typeNextCharacter = () => {
    index += 1;
    title.textContent = fullText.slice(0, index);

    if (index < fullText.length) {
      window.setTimeout(typeNextCharacter, 70);
      return;
    }

    title.classList.remove("typing-active");
  };

  window.setTimeout(typeNextCharacter, 350);
}

startHeroTyping();
