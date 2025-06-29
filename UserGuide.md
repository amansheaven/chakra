Perfect — here's your updated **Chakra Extension User Guide**, reflecting the new project name, GitHub availability, and extensibility.

---

# 🧭 Chakra – Colab Markdown Extractor & Viewer

**Chakra** is a Chrome extension that adds a beautiful, theme-aware, and resizable slide-out panel to Google Colab. It extracts and displays all **markdown and code cells** in a clean, navigable format — empowering you to view your notebook’s structure at a glance.

🔗 Available on GitHub:
**[https://github.com/amansheaven/chakra](https://github.com/amansheaven/chakra)**

---

## 📦 1. Installing Chakra Locally (Dev Mode)

### 🗂 Folder Structure

Make sure your Chakra extension folder looks like:

```
📁 chakra/
├── manifest.json
├── content.js
├── page-script.js
├── icon.png         ← Toolbar icon (PNG format)
├── chakra-geo.svg   ← Toggle icon (inline or optional)
```

### 🔌 Load into Chrome

1. Open Chrome and go to: `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **“Load unpacked”**
4. Select your local `chakra/` folder

You’ll now see the **Chakra icon** in your extensions bar.

---

## 🧪 2. Using Chakra in Google Colab

1. Open any notebook on
   [colab.research.google.com](https://colab.research.google.com)

2. Look for the **Chakra icon (wheel)** on the right edge

3. Click the icon:

   * 🔓 Panel slides out
   * 📖 Markdown and code cells show as neatly labeled tiles
   * 🎛️ Resize via left edge drag
   * 🕶️ Works in light and dark themes

4. Press `Esc` or click the icon again to close

---

## 🧰 3. Features

✅ View **all markdown and code cells** without scrolling
✅ Fully **theme-adaptive** with Colab’s light/dark mode
✅ **Resizable**, **remembering panel width and state**
✅ Fully local — no cloud processing, no data leaves your browser
✅ Smart retry logic if Colab isn’t ready
✅ Powered by a custom Chakra icon toggle

---

## 🛠 4. Build on Top of Chakra

Chakra is built to be **developer-friendly and extensible**:

### Add Your Own Features:

* ✅ Cell filtering (e.g. show only markdown)
* ✅ Copy/export buttons for each tile
* ✅ Syntax highlighting
* ✅ Toggle between raw/HTML-rendered markdown
* ✅ Keyboard shortcuts (`Alt+M`, etc.)

### How Chakra Works:

* `page-script.js` extracts content from Colab's editor (Monaco)
* `content.js` creates and controls the viewer UI
* Communication uses `window.postMessage`
* Chakra’s toggle and panel are styled via pure DOM API — no framework lock-in

---

## 🌍 Open Source on GitHub

📂 Code:
[https://github.com/amansheaven/chakra](https://github.com/amansheaven/chakra)

👋 Contributions, ideas, and pull requests are welcome!

You can fork it, clone it, or even publish your own flavor — Chakra is yours to extend.

---

## 🧹 5. Troubleshooting

| Problem                    | Solution                                                  |
| -------------------------- | --------------------------------------------------------- |
| Icon doesn't show          | Reload the page or check SVG/img setup                    |
| Panel is empty             | Switch to Python script view or open a different notebook |
| Panel scrolls horizontally | Use `content.js` version with `overflow-x: hidden` fixes  |
| Chrome icon is missing     | Use `icon.png` (not SVG) in `manifest.json`               |

---

## 🧭 Summary

> Chakra gives you a third-eye view of your Colab notebook — a fast, clean, and extendable way to surface your notebook’s structure.

---

Would you like this exported as:

* 📄 `README.md` (for your GitHub repo)?
* 📘 PDF quickstart guide?
* 🖼️ Branded screenshot or banner?

I can help you ship Chakra polished and ready.
