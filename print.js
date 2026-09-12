const PRINT_KEY = "plainTabsNotesPrintJob";

const I18N = {
  bg: {
    pageTitle: "Печат на бележка",
    toolbarPrefix: "Печат на бележка: ",
    printBtn: "Принтирай",
    closeBtn: "Затвори",
    defaultTitle: "Без име"
  },
  en: {
    pageTitle: "Print Note",
    toolbarPrefix: "Print note: ",
    printBtn: "Print",
    closeBtn: "Close",
    defaultTitle: "Untitled"
  }
};

function closeCurrentTab() {
  if (globalThis.chrome && chrome.tabs && typeof chrome.tabs.getCurrent === "function") {
    try {
      chrome.tabs.getCurrent((currentTab) => {
        if (currentTab && Number.isInteger(currentTab.id)) {
          chrome.tabs.remove(currentTab.id);
        } else {
          window.close();
        }
      });
      return;
    } catch (_error) {
      // Fall through to window.close.
    }
  }

  window.close();
}

async function loadPrintData() {
  if (globalThis.chrome && chrome.storage && chrome.storage.local) {
    try {
      const stored = await chrome.storage.local.get(PRINT_KEY);
      if (stored && stored[PRINT_KEY]) {
        return stored[PRINT_KEY];
      }
    } catch (error) {
      console.warn("Could not read print payload from storage", error);
    }
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has("title") || params.has("content")) {
    return {
      title: params.get("title") || "",
      content: params.get("content") || "",
      language: params.get("lang") || "bg"
    };
  }

  return null;
}

async function init() {
  const data = await loadPrintData();
  const lang = (data && data.language === "en") ? "en" : "bg";
  const texts = I18N[lang] || I18N.bg;

  const rawTitle = data && typeof data.title === "string" ? data.title.trim() : "";
  const title = rawTitle || texts.defaultTitle;
  const content = data && typeof data.content === "string" ? data.content : "";

  document.title = title;
  document.documentElement.lang = lang;

  const toolbarInfoEl = document.getElementById("toolbarInfo");
  const printTitleEl = document.getElementById("printTitle");
  const printBodyEl = document.getElementById("printBody");
  const printBtn = document.getElementById("printBtn");
  const closeBtn = document.getElementById("closeBtn");

  if (toolbarInfoEl) {
    toolbarInfoEl.innerHTML = `${texts.toolbarPrefix}<strong></strong>`;
    const strong = toolbarInfoEl.querySelector("strong");
    if (strong) {
      strong.textContent = title;
    }
  }

  if (printTitleEl) {
    printTitleEl.textContent = title;
  }

  if (printBodyEl) {
    printBodyEl.textContent = content;
  }

  if (printBtn) {
    printBtn.textContent = `\u2399 ${texts.printBtn}`;
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (closeBtn) {
    closeBtn.textContent = `\u00D7 ${texts.closeBtn}`;
    closeBtn.addEventListener("click", () => {
      closeCurrentTab();
    });
  }

  window.addEventListener("afterprint", () => {
    closeCurrentTab();
  });

  // Short delay to allow browser layout and font rendering before the modal print dialog opens.
  setTimeout(() => {
    window.print();
  }, 160);
}

document.addEventListener("DOMContentLoaded", init);
