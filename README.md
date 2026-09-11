# Plain Tabs Notes Extension

## 1. Project Overview & Tech Stack

Plain Tabs Notes Extension is a lightweight Chrome Manifest V3 extension for fast plain-text note taking in a persistent right-side Chrome side panel. It behaves like a minimal Notepad++-style scratchpad: multiple note tabs, automatic local persistence, simple text import, and export to common text/code file extensions.

Core features:

- Opens from the extension icon into Chrome's right-side side panel when available.
- Falls back to a compact docked popup window on the right side of the current Chrome window when the Side Panel API is unavailable.
- Uses Bulgarian as the default interface language and persists an optional English UI setting.
- Supports up to 10 note tabs to keep local storage predictable.
- Uses a thin horizontal tab strip above the editor to preserve writing space in the side panel.
- Uses a minimal icon-first interface with quiet borders, compact controls, and status/meta information in the editor footer.
- Deletes tabs from a small per-tab x control without a confirmation popup.
- Clears the active note immediately without a confirmation popup.
- Uses a plain `<textarea>` editor with no rich text formatting and no syntax highlighting.
- Auto-saves note state into `chrome.storage.local` without creating disk files.
- Exports the active note as `.txt`, `.md`, `.js`, `.py`, or `.html`.
- Imports text-like files into a new note tab when capacity allows.
- Prints the active note through the standard Chrome/system print dialog.
- Includes a small isolated calculator panel for quick arithmetic, including keyboard and Numpad input.

Tech stack:

- Chrome Extension Manifest V3
- HTML5, CSS3, vanilla JavaScript
- `chrome.storage.local` for local persistence
- No npm packages, build tools, bundlers, external APIs, or network calls

## 2. Quick Start & Environment Setup

Requirements:

- Google Chrome or a Chromium-based browser with Manifest V3 support.
- Developer Mode enabled in `chrome://extensions`.

Local install:

1. Open Chrome and go to `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project directory.
5. Pin the extension if desired.
6. Click the extension icon to open the notes window.

Environment variables:

- No environment variables are required.
- `.env.example` exists only as a project-standard placeholder.
- Do not add real tokens, passwords, cookies, account IDs, or private infrastructure details to this repository.

## 3. Architecture & File Map

```text
plain-tabs-notes-extension/
  .gitignore
  README.md
  .env.example
  manifest.json
  background.js
  app.html
  app.css
  app.js
  icons/
    icon.svg
    icon16.png
    icon32.png
    icon48.png
    icon128.png
  scripts/
    generate-icons.ps1
```

Key files:

- `manifest.json` defines the Manifest V3 extension, permissions, icons, and background service worker.
- `background.js` handles the extension icon click, opens the right-side Chrome side panel, and falls back to a docked popup window when needed.
- `app.html` contains the app shell, horizontal note tabs, note editor, compact action menu, import/export controls, and calculator markup.
- `app.css` contains the minimal side-panel layout and visual styling.
- `app.js` owns note state, auto-save, import/export, tab management, keyboard shortcuts, and calculator behavior.
- `icons/icon.svg` is the source icon artwork.
- `scripts/generate-icons.ps1` regenerates PNG icon sizes used by Chrome.

## 4. Anti-Breakage Rules

> [!WARNING]
> Critical for developers and AI agents: keep the extension small, local, and dependency-free unless the project scope is explicitly changed.

- Do not add `default_popup` to `manifest.json` unless you intentionally remove side-panel behavior. Chrome action popups close when focus leaves them, which is bad for note taking.
- Keep `side_panel.default_path` pointed at `app.html` unless the app shell is split intentionally.
- The fallback popup window cannot be made always-on-top by standard Chrome extension APIs. Use the side panel for persistent right-side behavior inside Chrome.
- Do not use `eval`, `new Function`, inline scripts, or dynamic code execution. Manifest V3 Content Security Policy blocks unsafe script execution and Chrome Web Store review may reject it.
- Do not mix calculator state into the note storage schema. The calculator is intentionally isolated UI state.
- Keep state.language in the local storage schema; it controls only interface labels and must not transform user note content.
- The per-tab x delete action and active-note clear action are intentionally immediate. Do not reintroduce browser confirmation popups unless the product decision changes.
- Keep the note tabs horizontal and compact. The side panel is width-limited, so reintroducing a left tab column significantly reduces the editor area.
- Keep toolbar commands icon-first and preserve their translated `title` and `aria-label` attributes. Visible toolbar text quickly consumes side-panel width.
- Keep rename, duplicate, and clear inside the `tabActionsMenu` details menu unless the side panel layout is redesigned.
- Calculator keyboard handling must not intercept typing while focus is inside note content, note title, selects, inputs, or contenteditable elements.
- Printing intentionally uses `window.print()` and `@media print`. Do not add printer-driver integrations, native messaging, or printer permissions unless the project scope explicitly changes.
- Do not silently remove the 10-tab cap. If more tabs are needed, review `chrome.storage.local` quota behavior and large-file performance first.
- Do not replace export/download with direct file writes without documenting File System Access API permissions, persistence behavior, browser compatibility, and user prompts.
- Do not introduce external network calls, analytics, CDNs, remote fonts, or third-party scripts. The tool should work offline.
- Do not store secrets in extension files, Chrome storage, README examples, screenshots, or test fixtures.
- If changing the icon source, regenerate all PNG icon sizes and verify `manifest.json` still points to valid files.
- Keep all note content as plain strings. Rich text, Markdown preview, and syntax highlighting are explicitly out of scope for v1.

## 5. Build, Test & Deployment

Build:

- No build step is required.
- The extension runs directly from source via Chrome `Load unpacked`.

Regenerate icons:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\generate-icons.ps1
```

Manual test checklist:

- Load the extension through `chrome://extensions`.
- Click the extension icon and confirm the right-side Chrome side panel opens.
- If the browser does not support side panels, confirm a compact fallback window opens on the right side of the current Chrome window.
- Create notes until the 10-tab limit is reached.
- Type in multiple tabs, close the window, reopen it, and confirm notes persist.
- Switch the interface between Bulgarian and English and confirm the selected language persists.
- Rename, duplicate, clear, and delete note tabs with the small per-tab x control.
- Open the `...` tab actions menu and confirm rename, duplicate, and clear still work.
- Confirm clearing a note does not open a browser confirmation popup.
- Print the active note and confirm the preview contains only the note title and plain text content, not the full app interface.
- Import a `.txt` or `.md` file and confirm it opens as a note tab.
- Export notes as `.txt`, `.md`, `.js`, `.py`, and `.html`.
- Toggle the calculator and test basic operations: add, subtract, multiply, divide, decimal input, clear, and backspace.
- With the calculator open and focus outside the note editor/title, test keyboard and Numpad input: digits, operators, decimal, Enter, Backspace, Delete, Escape, and percent.
- Reload the extension and confirm saved notes still load.

Deployment:

- For local use, keep loading the folder as an unpacked extension.
- For sharing, zip the project folder after verifying no private files or credentials are included.
- For Chrome Web Store submission, review Manifest V3 policy requirements and include the PNG icons.
