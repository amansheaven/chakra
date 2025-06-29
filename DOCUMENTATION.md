# Chakra - Colab Markdown Extractor (LLM-Friendly Guide)

## Overview

**Chakra** is a Chrome extension that adds a resizable, theme-aware, and toggleable slide-out panel to [Google Colab](https://colab.research.google.com). It extracts and displays **all markdown and code cells** from notebooks exported as Python scripts (via `# %%` cell markers). Each cell is rendered as a clean, labeled tile inside a smart viewer.

---

## Core Components

### 1. `manifest.json`

Defines:

* Permissions and host matchers (`https://colab.research.google.com/*`)
* `content.js` injection point (`document_idle`)
* Makes `page-script.js` and icons accessible via `web_accessible_resources`

### 2. `page-script.js`

Runs inside Colab’s DOM to:

* Access the Monaco editor content
* Parse the notebook into `{ type: "markdown" | "code", content: string[] }` cells
* Posts the extracted cells via `window.postMessage(...)`

### 3. `content.js`

Controls the panel UI:

* Injects Chakra viewer and toggle button
* Listens for messages from `page-script.js`
* Renders each markdown/code cell as a styled tile
* Enables resize, toggle, Esc-to-close, scroll-sync, and theme adaptation

---

## UI Behavior

### 🧩 Toggle Button

* Appears on the **right edge** of Colab
* Uses a **Chakra icon** (SVG) rotated 90° by default
* Spins **180° on hover** via CSS
* Opens and closes the panel

### 🪟 Panel Viewer

* Slides in from the right
* Width is **resizable**, state stored in `localStorage`
* Background uses `#f4f4f4` in light mode and `#1e1e1e` in dark mode
* Displays tiles for each cell:

  * `[MARKDOWN]` or `[CODE]`
  * Preserves line breaks and scrollability
* **Clicking a tile scrolls to the matching cell** in the notebook

### 🧠 Scroll Persistence

* The panel remembers your last scroll position
* Re-opens at the same scroll depth

---

## Message Format

Sent from `page-script.js` to the page:

```js
window.postMessage({
  source: "colab-markdown-extractor",
  cells: [
    { type: "markdown", content: ["line 1", "line 2"] },
    { type: "code", content: ["import pandas as pd"] }
  ]
}, "*");
```

Listened for by `content.js`:

```js
window.addEventListener("message", (ev) => {
  if (ev.source !== window) return;
  if (ev.data?.source !== "colab-markdown-extractor") return;

  const cells = ev.data.cells || [];
  cells.forEach(cell => {
    // render cell tile
  });
});
```

---

## Example Usage Flow

1. User opens a Colab notebook and switches to Python script view
2. Chakra loads and injects a hidden side panel
3. `page-script.js` scrapes all markdown + code cells via Monaco
4. Toggle (Chakra icon) appears on the right
5. Clicking it reveals the panel with rendered cell tiles
6. Clicking a tile scrolls the Colab notebook to that cell
7. User can resize the panel, close with `Esc`, or re-toggle

---

## Notes for LLMs

* Code is **zero-dependency** (pure DOM APIs)
* UI and extraction logic are **cleanly decoupled**
* Follows CSP via `web_accessible_resources` in manifest
* Panel respects Colab’s theme (`<html theme="...">`)
* Toggle uses **inline SVG** for Chakra with hover animation
* Panel state (width, scroll, open) is persisted via `localStorage`
* Matching is fuzzy — uses partial cell content to scroll to original

---

## Optional Enhancements (LLMs May Suggest)

* Add filters (`Only markdown` / `Only code`)
* Add copy/export buttons
* Render markdown using `marked.js` or `markdown-it`
* Add keyboard shortcuts (`Alt+M` to open/close)
* Use Shadow DOM to isolate Chakra styles

---

✅ Let me know if you'd like this saved as `README.md`, or linked to your GitHub repo for display.

Also — I can generate a diagram or flowchart if you want a visual guide for LLMs!
