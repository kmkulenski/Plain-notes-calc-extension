const STORAGE_KEY = "plainTabsNotesStateV1";
const MAX_TABS = 10;
const SAVE_DELAY_MS = 180;
const DEFAULT_LANGUAGE = "bg";
const LANGUAGES = ["bg", "en"];
const EXPORT_FORMATS = ["txt", "md", "js", "py", "html"];
const EXTENSION_ALIASES = {
  markdown: "md",
  htm: "html"
};

const MIME_TYPES = {
  txt: "text/plain;charset=utf-8",
  md: "text/markdown;charset=utf-8",
  js: "text/javascript;charset=utf-8",
  py: "text/x-python;charset=utf-8",
  html: "text/html;charset=utf-8"
};

const I18N = {
  bg: {
    "app.title": "Бележки с табове",
    "brand.name": "Бележки с табове",
    "defaultTitle": "Без име",
    "notePrefix": "Бележка",
    "copySuffix": "копие",
    "aria.noteTools": "Инструменти за бележки",
    "aria.notes": "Бележки",
    "aria.noteTabs": "Табове с бележки",
    "aria.tabActions": "Действия за таба",
    "aria.activeNote": "Активна бележка",
    "aria.noteTitle": "Име на бележката",
    "aria.noteContent": "Съдържание на бележката",
    "aria.calculator": "Калкулатор",
    "aria.calculatorDisplay": "Дисплей на калкулатора",
    "aria.calculatorButtons": "Бутони на калкулатора",
    "button.calc": "Калк",
    "button.open": "Отвори",
    "button.print": "Печат",
    "button.export": "Експорт",
    "button.rename": "Преименувай",
    "button.copy": "Копие",
    "button.clear": "Изчисти",
    "calculator.title": "Калкулатор",
    "calculator.back": "Назад",
    "title.language": "Език на интерфейса",
    "title.calc": "Покажи/скрий калкулатора",
    "title.open": "Отвори текстов файл",
    "title.print": "Принтирай активната бележка",
    "title.format": "Формат за експорт",
    "title.export": "Експортирай активната бележка",
    "title.newTab": "Нов таб с бележка",
    "title.rename": "Преименувай активния таб",
    "title.copy": "Дублирай активния таб",
    "title.clear": "Изчисти активната бележка",
    "title.closeCalc": "Затвори калкулатора",
    "title.closeTab": "Изтрий таба",
    "meta": "{chars} знака / {lines} реда",
    "prompt.rename": "Преименувай таба",
    "status.saved": "Запазено локално",
    "status.saving": "Запазване",
    "status.saveFailed": "Грешка при запазване",
    "status.storageReset": "Локалното състояние е нулирано",
    "status.tabLimit": "Достигнат е лимитът от табове",
    "status.newTab": "Новият таб е запазен локално",
    "status.renamed": "Преименувано локално",
    "status.cleared": "Изчистено локално",
    "status.deleted": "Табът е изтрит",
    "status.lastReset": "Последният таб е изчистен",
    "status.exported": "Експортирано копие",
    "status.importedNew": "Импортирано като нов таб",
    "status.importSkipped": "Няма свободен таб за импорт",
    "status.importFailed": "Грешка при импорт",
    "status.formatSaved": "Форматът е запазен локално",
    "status.languageSaved": "Езикът е запазен",
    "status.printReady": "Готово за печат"
  },
  en: {
    "app.title": "Plain Tabs Notes",
    "brand.name": "Plain Tabs Notes",
    "defaultTitle": "Untitled",
    "notePrefix": "Note",
    "copySuffix": "copy",
    "aria.noteTools": "Note tools",
    "aria.notes": "Notes",
    "aria.noteTabs": "Note tabs",
    "aria.tabActions": "Tab actions",
    "aria.activeNote": "Active note",
    "aria.noteTitle": "Note title",
    "aria.noteContent": "Note content",
    "aria.calculator": "Calculator",
    "aria.calculatorDisplay": "Calculator display",
    "aria.calculatorButtons": "Calculator buttons",
    "button.calc": "Calc",
    "button.open": "Open",
    "button.print": "Print",
    "button.export": "Export",
    "button.rename": "Rename",
    "button.copy": "Copy",
    "button.clear": "Clear",
    "calculator.title": "Calculator",
    "calculator.back": "Back",
    "title.language": "Interface language",
    "title.calc": "Toggle calculator",
    "title.open": "Import text file",
    "title.print": "Print active note",
    "title.format": "Export format",
    "title.export": "Export active note",
    "title.newTab": "New note tab",
    "title.rename": "Rename active tab",
    "title.copy": "Duplicate active tab",
    "title.clear": "Clear active note",
    "title.closeCalc": "Close calculator",
    "title.closeTab": "Delete tab",
    "meta": "{chars} chars / {lines} lines",
    "prompt.rename": "Rename note tab",
    "status.saved": "Saved locally",
    "status.saving": "Saving",
    "status.saveFailed": "Save failed",
    "status.storageReset": "Storage reset",
    "status.tabLimit": "Tab limit reached",
    "status.newTab": "New tab saved locally",
    "status.renamed": "Renamed locally",
    "status.cleared": "Cleared locally",
    "status.deleted": "Tab deleted",
    "status.lastReset": "Last tab cleared",
    "status.exported": "Exported copy",
    "status.importedNew": "Imported as new tab",
    "status.importSkipped": "No free tab for import",
    "status.importFailed": "Import failed",
    "status.formatSaved": "Format saved locally",
    "status.languageSaved": "Language saved",
    "status.printReady": "Ready to print"
  }
};

let state = createDefaultState();
let saveTimer = null;
let statusTimer = null;

const dom = {
  status: document.getElementById("status"),
  languageSelect: document.getElementById("languageSelect"),
  tabsCount: document.getElementById("tabsCount"),
  tabsList: document.getElementById("tabsList"),
  addTabButton: document.getElementById("addTabButton"),
  tabActionsMenu: document.getElementById("tabActionsMenu"),
  renameTabButton: document.getElementById("renameTabButton"),
  duplicateTabButton: document.getElementById("duplicateTabButton"),
  clearTabButton: document.getElementById("clearTabButton"),
  noteTitleInput: document.getElementById("noteTitleInput"),
  noteContentInput: document.getElementById("noteContentInput"),
  noteMeta: document.getElementById("noteMeta"),
  formatSelect: document.getElementById("formatSelect"),
  exportButton: document.getElementById("exportButton"),
  importButton: document.getElementById("importButton"),
  printButton: document.getElementById("printButton"),
  fileInput: document.getElementById("fileInput"),
  toggleCalcButton: document.getElementById("toggleCalcButton"),
  closeCalcButton: document.getElementById("closeCalcButton"),
  calculatorPane: document.getElementById("calculatorPane"),
  calculatorDisplay: document.getElementById("calculatorDisplay"),
  printDocument: document.getElementById("printDocument"),
  printTitle: document.getElementById("printTitle"),
  printBody: document.getElementById("printBody")
};

const calculator = {
  display: "0",
  firstOperand: null,
  operator: null,
  waitingForOperand: false
};

function createDefaultState() {
  const tab = createTab(I18N[DEFAULT_LANGUAGE].defaultTitle, "", "txt");

  return {
    version: 1,
    language: DEFAULT_LANGUAGE,
    activeTabId: tab.id,
    tabs: [tab]
  };
}

function createTab(title, content, extension) {
  const now = Date.now();

  return {
    id: createId(),
    title: title || I18N[DEFAULT_LANGUAGE].defaultTitle,
    content: content || "",
    extension: normalizeExtension(extension),
    createdAt: now,
    updatedAt: now
  };
}

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `tab-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function currentLanguage() {
  return LANGUAGES.includes(state.language) ? state.language : DEFAULT_LANGUAGE;
}

function translate(key, values = {}) {
  const language = currentLanguage();
  const dictionary = I18N[language] || I18N[DEFAULT_LANGUAGE];
  const fallback = I18N.en[key] || I18N[DEFAULT_LANGUAGE][key] || key;
  let text = dictionary[key] || fallback;

  Object.entries(values).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });

  return text;
}

function normalizeExtension(extension) {
  const raw = String(extension || "txt").replace(/^\./, "").toLowerCase();
  const normalized = EXTENSION_ALIASES[raw] || raw;

  return EXPORT_FORMATS.includes(normalized) ? normalized : "txt";
}

function getActiveTab() {
  return state.tabs.find((tab) => tab.id === state.activeTabId) || state.tabs[0];
}

function sanitizeState(inputState) {
  const safeState = inputState && typeof inputState === "object" ? inputState : createDefaultState();
  const tabs = Array.isArray(safeState.tabs) ? safeState.tabs.slice(0, MAX_TABS) : [];

  safeState.tabs = tabs.map((tab) => ({
    id: tab.id || createId(),
    title: String(tab.title || I18N[DEFAULT_LANGUAGE].defaultTitle).slice(0, 80),
    content: typeof tab.content === "string" ? tab.content : "",
    extension: normalizeExtension(tab.extension),
    createdAt: Number(tab.createdAt) || Date.now(),
    updatedAt: Number(tab.updatedAt) || Date.now()
  }));

  if (safeState.tabs.length === 0) {
    safeState.tabs.push(createTab(I18N[DEFAULT_LANGUAGE].defaultTitle, "", "txt"));
  }

  if (!safeState.tabs.some((tab) => tab.id === safeState.activeTabId)) {
    safeState.activeTabId = safeState.tabs[0].id;
  }

  safeState.language = LANGUAGES.includes(safeState.language) ? safeState.language : DEFAULT_LANGUAGE;
  safeState.version = 1;
  return safeState;
}

async function readStoredState() {
  if (globalThis.chrome && chrome.storage && chrome.storage.local) {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] || null;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function writeStoredState(nextState) {
  if (globalThis.chrome && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [STORAGE_KEY]: nextState });
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function applyTranslations() {
  const language = currentLanguage();

  document.documentElement.lang = language;
  document.title = translate("app.title");
  dom.languageSelect.value = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = translate(element.dataset.i18nTitle);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAria));
  });
}

function setStatus(message, holdMs = 1600) {
  clearTimeout(statusTimer);
  dom.status.textContent = message;

  if (holdMs > 0) {
    statusTimer = setTimeout(() => {
      dom.status.textContent = translate("status.saved");
    }, holdMs);
  }
}

function queueSave(message = translate("status.saved")) {
  clearTimeout(saveTimer);
  setStatus(translate("status.saving"), 0);

  saveTimer = setTimeout(async () => {
    try {
      state = sanitizeState(state);
      await writeStoredState(state);
      setStatus(message);
    } catch (error) {
      console.error(error);
      setStatus(translate("status.saveFailed"), 3000);
    }
  }, SAVE_DELAY_MS);
}

function renderAll() {
  renderTabs();
  renderEditor();
  renderMeta();
}

function renderTabs() {
  dom.tabsList.textContent = "";

  const fragment = document.createDocumentFragment();

  state.tabs.forEach((tab) => {
    const row = document.createElement("div");
    row.className = "tab-row";

    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${tab.id === state.activeTabId ? " is-active" : ""}`;
    button.dataset.tabId = tab.id;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", tab.id === state.activeTabId ? "true" : "false");
    button.title = tab.title;

    const name = document.createElement("span");
    name.className = "tab-name";
    name.textContent = tab.title || translate("defaultTitle");

    const ext = document.createElement("span");
    ext.className = "tab-ext";
    ext.textContent = `.${tab.extension}`;

    const close = document.createElement("button");
    close.type = "button";
    close.className = "tab-close";
    close.dataset.closeTabId = tab.id;
    close.textContent = "x";
    close.title = translate("title.closeTab");
    close.setAttribute("aria-label", `${translate("title.closeTab")}: ${tab.title || translate("defaultTitle")}`);

    button.append(name, ext);
    row.append(button, close);
    fragment.append(row);
  });

  dom.tabsList.append(fragment);
  dom.tabsCount.textContent = `${state.tabs.length}/${MAX_TABS}`;
  dom.addTabButton.disabled = state.tabs.length >= MAX_TABS;
  dom.duplicateTabButton.disabled = state.tabs.length >= MAX_TABS;
}

function renderEditor() {
  const tab = getActiveTab();
  dom.noteTitleInput.value = tab.title || "";
  dom.noteContentInput.value = tab.content || "";
  dom.formatSelect.value = normalizeExtension(tab.extension);
}

function renderMeta() {
  const tab = getActiveTab();
  const chars = tab.content.length;
  const lines = tab.content.length ? tab.content.split(/\r\n|\r|\n/).length : 0;
  dom.noteMeta.textContent = translate("meta", { chars, lines });
}

function switchTab(tabId) {
  if (!state.tabs.some((tab) => tab.id === tabId)) {
    return;
  }

  state.activeTabId = tabId;
  renderAll();
  queueSave();
}

function newNoteTitle() {
  return `${translate("notePrefix")} ${state.tabs.length + 1}`;
}

function addTab(title = newNoteTitle(), content = "", extension = "txt") {
  if (state.tabs.length >= MAX_TABS) {
    setStatus(translate("status.tabLimit"), 2200);
    return null;
  }

  const tab = createTab(title, content, extension);
  state.tabs.push(tab);
  state.activeTabId = tab.id;
  renderAll();
  queueSave(translate("status.newTab"));
  dom.noteContentInput.focus();
  return tab;
}

function renameActiveTab() {
  const tab = getActiveTab();
  const nextTitle = prompt(translate("prompt.rename"), tab.title);

  if (nextTitle === null) {
    return;
  }

  tab.title = cleanTitle(nextTitle);
  tab.updatedAt = Date.now();
  renderAll();
  queueSave(translate("status.renamed"));
}

function duplicateActiveTab() {
  const tab = getActiveTab();

  if (state.tabs.length >= MAX_TABS) {
    setStatus(translate("status.tabLimit"), 2200);
    return;
  }

  addTab(`${tab.title} ${translate("copySuffix")}`, tab.content, tab.extension);
}

function clearActiveTab() {
  const tab = getActiveTab();
  tab.content = "";
  tab.updatedAt = Date.now();
  renderEditor();
  renderMeta();
  queueSave(translate("status.cleared"));
  dom.noteContentInput.focus();
}

function closeTabActionsMenu() {
  if (dom.tabActionsMenu) {
    dom.tabActionsMenu.open = false;
  }
}

function resetSingleTab(tab) {
  tab.title = translate("defaultTitle");
  tab.content = "";
  tab.extension = "txt";
  tab.updatedAt = Date.now();
  state.activeTabId = tab.id;
  renderAll();
  queueSave(translate("status.lastReset"));
  dom.noteContentInput.focus();
}

function removeTab(tabId) {
  const tabIndex = state.tabs.findIndex((tab) => tab.id === tabId);

  if (tabIndex === -1) {
    return;
  }

  if (state.tabs.length <= 1) {
    resetSingleTab(state.tabs[tabIndex]);
    return;
  }

  const wasActive = state.activeTabId === tabId;
  state.tabs.splice(tabIndex, 1);

  if (wasActive || !state.tabs.some((tab) => tab.id === state.activeTabId)) {
    const nextIndex = Math.min(tabIndex, state.tabs.length - 1);
    state.activeTabId = state.tabs[Math.max(0, nextIndex)].id;
  }

  renderAll();
  queueSave(translate("status.deleted"));
}

function cleanTitle(title) {
  const cleaned = String(title || "").trim();
  return cleaned ? cleaned.slice(0, 80) : translate("defaultTitle");
}

function safeFileName(title) {
  return cleanTitle(title)
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function exportActiveTab() {
  const tab = getActiveTab();
  const extension = normalizeExtension(dom.formatSelect.value || tab.extension);
  tab.extension = extension;
  tab.updatedAt = Date.now();

  const blob = new Blob([tab.content], { type: MIME_TYPES[extension] || MIME_TYPES.txt });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${safeFileName(tab.title)}.${extension}`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  renderTabs();
  queueSave(translate("status.exported"));
}

function preparePrintDocument() {
  const tab = getActiveTab();
  dom.printTitle.textContent = tab.title || translate("defaultTitle");
  dom.printBody.textContent = tab.content || "";
  dom.printDocument.setAttribute("aria-hidden", "false");
}

function printActiveTab() {
  preparePrintDocument();
  setStatus(translate("status.printReady"), 1800);

  requestAnimationFrame(() => {
    window.print();
  });
}

function cleanupPrintDocument() {
  dom.printDocument.setAttribute("aria-hidden", "true");
}


function inferExtension(fileName) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName || "");
  return normalizeExtension(match ? match[1] : "txt");
}

function titleFromFileName(fileName) {
  return cleanTitle(String(fileName || translate("defaultTitle")).replace(/\.[^.]+$/, ""));
}

async function importFile(file) {
  if (!file) {
    return;
  }

  if (state.tabs.length >= MAX_TABS) {
    setStatus(translate("status.importSkipped"), 2200);
    return;
  }

  const content = await file.text();
  const title = titleFromFileName(file.name);
  const extension = inferExtension(file.name);

  addTab(title, content, extension);
  setStatus(translate("status.importedNew"), 1800);
}

function handleEditorInput() {
  const tab = getActiveTab();
  tab.content = dom.noteContentInput.value;
  tab.updatedAt = Date.now();
  renderMeta();
  queueSave();
}

function handleTitleInput() {
  const tab = getActiveTab();
  tab.title = cleanTitle(dom.noteTitleInput.value);
  tab.updatedAt = Date.now();
  renderTabs();
  queueSave();
}

function handleFormatChange() {
  const tab = getActiveTab();
  tab.extension = normalizeExtension(dom.formatSelect.value);
  tab.updatedAt = Date.now();
  renderTabs();
  queueSave(translate("status.formatSaved"));
}

function handleLanguageChange() {
  const language = dom.languageSelect.value;

  if (!LANGUAGES.includes(language)) {
    return;
  }

  state.language = language;
  applyTranslations();
  renderAll();
  queueSave(translate("status.languageSaved"));
}

function toggleCalculator(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean"
    ? forceOpen
    : dom.calculatorPane.classList.contains("is-hidden");

  dom.calculatorPane.classList.toggle("is-hidden", !shouldOpen);
  dom.toggleCalcButton.setAttribute("aria-pressed", shouldOpen ? "true" : "false");
}

function updateCalculatorDisplay() {
  dom.calculatorDisplay.value = calculator.display;
}

function resetCalculator() {
  calculator.display = "0";
  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.waitingForOperand = false;
  updateCalculatorDisplay();
}

function inputDigit(digit) {
  if (calculator.display === "Error") {
    resetCalculator();
  }

  if (calculator.waitingForOperand) {
    calculator.display = digit;
    calculator.waitingForOperand = false;
  } else {
    calculator.display = calculator.display === "0" ? digit : calculator.display + digit;
  }

  updateCalculatorDisplay();
}

function inputDecimal() {
  if (calculator.waitingForOperand) {
    calculator.display = "0.";
    calculator.waitingForOperand = false;
  } else if (!calculator.display.includes(".")) {
    calculator.display += ".";
  }

  updateCalculatorDisplay();
}

function calculate(first, second, operator) {
  switch (operator) {
    case "add":
      return first + second;
    case "subtract":
      return first - second;
    case "multiply":
      return first * second;
    case "divide":
      return second === 0 ? null : first / second;
    default:
      return second;
  }
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  return String(Number.parseFloat(value.toFixed(10)));
}

function applyOperator(nextOperator) {
  const inputValue = Number.parseFloat(calculator.display);

  if (!Number.isFinite(inputValue)) {
    resetCalculator();
    return;
  }

  if (calculator.operator && !calculator.waitingForOperand) {
    const result = calculate(calculator.firstOperand, inputValue, calculator.operator);

    if (result === null) {
      calculator.display = "Error";
      calculator.firstOperand = null;
      calculator.operator = null;
      calculator.waitingForOperand = true;
      updateCalculatorDisplay();
      return;
    }

    calculator.display = formatNumber(result);
    calculator.firstOperand = result;
  } else {
    calculator.firstOperand = inputValue;
  }

  calculator.operator = nextOperator;
  calculator.waitingForOperand = true;
  updateCalculatorDisplay();
}

function handleCalculatorAction(action) {
  if (/^\d$/.test(action)) {
    inputDigit(action);
    return;
  }

  if (["add", "subtract", "multiply", "divide"].includes(action)) {
    applyOperator(action);
    return;
  }

  if (action === "decimal") {
    inputDecimal();
    return;
  }

  if (action === "equals") {
    applyOperator(null);
    calculator.operator = null;
    return;
  }

  if (action === "clear") {
    resetCalculator();
    return;
  }

  if (action === "back") {
    calculator.display = calculator.display.length > 1
      ? calculator.display.slice(0, -1)
      : "0";
    updateCalculatorDisplay();
    return;
  }

  if (action === "percent") {
    calculator.display = formatNumber(Number.parseFloat(calculator.display) / 100);
    updateCalculatorDisplay();
    return;
  }

  if (action === "sign") {
    calculator.display = calculator.display.startsWith("-")
      ? calculator.display.slice(1)
      : `-${calculator.display}`;
    updateCalculatorDisplay();
  }
}

function isTypingTarget(target) {
  if (!target || typeof target.closest !== "function") {
    return false;
  }

  if (target === dom.calculatorDisplay) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function isCalculatorOpen() {
  return !dom.calculatorPane.classList.contains("is-hidden");
}

function calculatorActionFromKeyboard(event) {
  if (/^\d$/.test(event.key)) {
    return event.key;
  }

  if (/^Numpad\d$/.test(event.code)) {
    return event.code.slice(-1);
  }

  const keyActions = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    ".": "decimal",
    ",": "decimal",
    "=": "equals",
    Enter: "equals",
    Backspace: "back",
    Escape: "clear",
    "%": "percent"
  };

  const codeActions = {
    NumpadAdd: "add",
    NumpadSubtract: "subtract",
    NumpadMultiply: "multiply",
    NumpadDivide: "divide",
    NumpadDecimal: "decimal",
    NumpadEnter: "equals"
  };

  return codeActions[event.code] || keyActions[event.key] || null;
}

function handleCalculatorKeyboard(event) {
  if (!isCalculatorOpen() || event.ctrlKey || event.altKey || event.metaKey || isTypingTarget(event.target)) {
    return;
  }

  const action = calculatorActionFromKeyboard(event);

  if (!action) {
    return;
  }

  event.preventDefault();
  handleCalculatorAction(action);
}

function handleKeyboardShortcuts(event) {
  if (!event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    return;
  }

  const key = event.key.toLowerCase();

  if (key === "s") {
    event.preventDefault();
    exportActiveTab();
  }

  if (key === "n") {
    event.preventDefault();
    addTab();
  }

  if (key === "o") {
    event.preventDefault();
    dom.fileInput.click();
  }

  if (key === "p") {
    event.preventDefault();
    printActiveTab();
  }
}

function handleTabActionsMenuEscape(event) {
  if (event.key !== "Escape" || !dom.tabActionsMenu || !dom.tabActionsMenu.open) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  closeTabActionsMenu();
}

function bindEvents() {
  dom.tabsList.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-tab-id]");

    if (closeButton) {
      event.stopPropagation();
      removeTab(closeButton.dataset.closeTabId);
      return;
    }

    const button = event.target.closest("[data-tab-id]");
    if (button) {
      switchTab(button.dataset.tabId);
    }
  });

  dom.addTabButton.addEventListener("click", () => addTab());
  dom.renameTabButton.addEventListener("click", () => {
    closeTabActionsMenu();
    renameActiveTab();
  });
  dom.duplicateTabButton.addEventListener("click", () => {
    closeTabActionsMenu();
    duplicateActiveTab();
  });
  dom.clearTabButton.addEventListener("click", () => {
    closeTabActionsMenu();
    clearActiveTab();
  });
  dom.noteTitleInput.addEventListener("input", handleTitleInput);
  dom.noteContentInput.addEventListener("input", handleEditorInput);
  dom.formatSelect.addEventListener("change", handleFormatChange);
  dom.languageSelect.addEventListener("change", handleLanguageChange);
  dom.exportButton.addEventListener("click", exportActiveTab);
  dom.printButton.addEventListener("click", printActiveTab);
  dom.importButton.addEventListener("click", () => dom.fileInput.click());
  dom.fileInput.addEventListener("change", async () => {
    const file = dom.fileInput.files[0];
    dom.fileInput.value = "";

    try {
      await importFile(file);
    } catch (error) {
      console.error(error);
      setStatus(translate("status.importFailed"), 3000);
    }
  });

  dom.toggleCalcButton.addEventListener("click", () => toggleCalculator());
  dom.closeCalcButton.addEventListener("click", () => toggleCalculator(false));
  dom.calculatorPane.addEventListener("click", (event) => {
    const button = event.target.closest("[data-calc]");
    if (button) {
      handleCalculatorAction(button.dataset.calc);
    }
  });

  document.addEventListener("click", (event) => {
    if (dom.tabActionsMenu && dom.tabActionsMenu.open && !dom.tabActionsMenu.contains(event.target)) {
      closeTabActionsMenu();
    }
  });

  document.addEventListener("keydown", handleTabActionsMenuEscape);
  document.addEventListener("keydown", handleKeyboardShortcuts);
  document.addEventListener("keydown", handleCalculatorKeyboard);
  window.addEventListener("beforeprint", preparePrintDocument);
  window.addEventListener("afterprint", cleanupPrintDocument);
}

async function init() {
  bindEvents();

  try {
    state = sanitizeState(await readStoredState());
  } catch (error) {
    console.error(error);
    state = createDefaultState();
    applyTranslations();
    setStatus(translate("status.storageReset"), 3000);
  }

  applyTranslations();
  renderAll();
  updateCalculatorDisplay();
  setStatus(translate("status.saved"));
  dom.noteContentInput.focus();
}

init();
