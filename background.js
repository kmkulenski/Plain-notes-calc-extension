const APP_WINDOW_ID_KEY = "plainTabsNotesWindowId";
const APP_URL = "app.html";
const APP_WINDOW_WIDTH = 460;
const APP_WINDOW_MIN_HEIGHT = 560;
const APP_WINDOW_MARGIN = 12;

let fallbackWindowId = null;

async function getStoredWindowId() {
  if (chrome.storage && chrome.storage.session) {
    const result = await chrome.storage.session.get(APP_WINDOW_ID_KEY);
    return result[APP_WINDOW_ID_KEY] || null;
  }

  return fallbackWindowId;
}

async function setStoredWindowId(windowId) {
  fallbackWindowId = windowId;

  if (chrome.storage && chrome.storage.session) {
    await chrome.storage.session.set({ [APP_WINDOW_ID_KEY]: windowId });
  }
}

async function clearStoredWindowId() {
  fallbackWindowId = null;

  if (chrome.storage && chrome.storage.session) {
    await chrome.storage.session.remove(APP_WINDOW_ID_KEY);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

async function getSourceWindow(tab) {
  if (tab && Number.isInteger(tab.windowId)) {
    try {
      return await chrome.windows.get(tab.windowId);
    } catch (_error) {
      // Fall back to the last focused normal window below.
    }
  }

  try {
    return await chrome.windows.getLastFocused({ windowTypes: ["normal"] });
  } catch (_error) {
    return null;
  }
}

async function openSidePanel(tab) {
  if (!chrome.sidePanel || typeof chrome.sidePanel.open !== "function") {
    return false;
  }

  if (!tab || !Number.isInteger(tab.windowId)) {
    return false;
  }

  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    return true;
  } catch (_error) {
    return false;
  }
}

function getDockedBounds(sourceWindow) {
  const screenLeft = Number.isFinite(sourceWindow && sourceWindow.left) ? sourceWindow.left : 0;
  const screenTop = Number.isFinite(sourceWindow && sourceWindow.top) ? sourceWindow.top : 0;
  const screenWidth = Number.isFinite(sourceWindow && sourceWindow.width) ? sourceWindow.width : 1200;
  const screenHeight = Number.isFinite(sourceWindow && sourceWindow.height) ? sourceWindow.height : 800;
  const maxHeight = Math.max(APP_WINDOW_MIN_HEIGHT, screenHeight - (APP_WINDOW_MARGIN * 2));
  const height = clamp(screenHeight - (APP_WINDOW_MARGIN * 2), APP_WINDOW_MIN_HEIGHT, maxHeight);

  return {
    width: APP_WINDOW_WIDTH,
    height,
    left: screenLeft + Math.max(APP_WINDOW_MARGIN, screenWidth - APP_WINDOW_WIDTH - APP_WINDOW_MARGIN),
    top: screenTop + APP_WINDOW_MARGIN
  };
}

async function focusExistingWindow(windowId, bounds) {
  try {
    await chrome.windows.update(windowId, { state: "normal" });
    await chrome.windows.update(windowId, { ...bounds, focused: true });
    return true;
  } catch (_error) {
    await clearStoredWindowId();
    return false;
  }
}

async function openDockedWindow(tab) {
  const sourceWindow = await getSourceWindow(tab);
  const bounds = getDockedBounds(sourceWindow);
  const existingWindowId = await getStoredWindowId();

  if (existingWindowId && await focusExistingWindow(existingWindowId, bounds)) {
    return;
  }

  const createdWindow = await chrome.windows.create({
    type: "popup",
    ...bounds,
    focused: true,
    url: chrome.runtime.getURL(APP_URL)
  });

  if (createdWindow && createdWindow.id) {
    await setStoredWindowId(createdWindow.id);
  }
}

async function closeSidePanelAPI(windowId) {
  if (!chrome.sidePanel || typeof chrome.sidePanel.close !== "function") {
    return false;
  }

  try {
    const targetWindowId = windowId || (await chrome.windows.getLastFocused()).id;
    await chrome.sidePanel.close({ windowId: targetWindowId });
    return true;
  } catch (_error) {
    return false;
  }
}

async function closeDockedWindow() {
  const existingWindowId = await getStoredWindowId();

  if (!existingWindowId) {
    return false;
  }

  try {
    await chrome.windows.remove(existingWindowId);
    await clearStoredWindowId();
    return true;
  } catch (_error) {
    await clearStoredWindowId();
    return false;
  }
}

async function closeNotesSurface() {
  if (await closeSidePanelAPI()) {
    return true;
  }

  return closeDockedWindow();
}

async function openNotesSurface(tab) {
  if (await openSidePanel(tab)) {
    return;
  }

  await openDockedWindow(tab);
}

chrome.action.onClicked.addListener((tab) => {
  openNotesSurface(tab);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message) {
    return false;
  }

  if (message.type === "closeNotesWindow") {
    closeNotesSurface().then((closed) => {
      sendResponse({ closed });
    });
    return true;
  }

  if (message.type === "openPrintTab") {
    const printUrl = chrome.runtime.getURL("print.html");
    chrome.tabs.create({ url: printUrl }).then((tab) => {
      sendResponse({ opened: Boolean(tab && tab.id), tabId: tab ? tab.id : null });
    }).catch((error) => {
      console.warn("Failed to open print tab in background", error);
      sendResponse({ opened: false, error: String(error) });
    });
    return true;
  }

  return false;
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const existingWindowId = await getStoredWindowId();

  if (existingWindowId === windowId) {
    await clearStoredWindowId();
  }
});
