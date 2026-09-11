const APP_WINDOW_ID_KEY = "plainTabsNotesWindowId";
const APP_URL = "app.html";
const APP_WINDOW = {
  type: "popup",
  width: 760,
  height: 560,
  focused: true
};

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

async function focusExistingWindow(windowId) {
  try {
    await chrome.windows.update(windowId, { focused: true });
    return true;
  } catch (_error) {
    await clearStoredWindowId();
    return false;
  }
}

async function openNotesWindow() {
  const existingWindowId = await getStoredWindowId();

  if (existingWindowId && await focusExistingWindow(existingWindowId)) {
    return;
  }

  const createdWindow = await chrome.windows.create({
    ...APP_WINDOW,
    url: chrome.runtime.getURL(APP_URL)
  });

  if (createdWindow && createdWindow.id) {
    await setStoredWindowId(createdWindow.id);
  }
}

chrome.action.onClicked.addListener(() => {
  openNotesWindow();
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const existingWindowId = await getStoredWindowId();

  if (existingWindowId === windowId) {
    await clearStoredWindowId();
  }
});