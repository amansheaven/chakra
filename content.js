console.log("[Chakra Extension] content.js loaded");

const pageScript = document.createElement("script");
pageScript.src = chrome.runtime.getURL("page-script.js");
pageScript.onload = () => pageScript.remove();
(document.head || document.documentElement).appendChild(pageScript);

function whenBodyReady(cb) {
  if (document.body) return cb();
  new MutationObserver((_, obs) => {
    if (document.body) {
      obs.disconnect();
      cb();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
}

function whenThemeReady(cb) {
  const tick = () => {
    if (document.documentElement.getAttribute("theme")) {
      cb();
    } else {
      requestAnimationFrame(tick);
    }
  };
  tick();
}

whenBodyReady(() => {
  whenThemeReady(buildUI);
});

function buildUI() {
  let PANEL_WIDTH = parseInt(
    localStorage.getItem("colab-md-panel-width") || "400",
    10
  );
  let scrollY = parseInt(localStorage.getItem("chakra-scroll") || "0", 10);

  const panel = document.createElement("div");
  panel.id = "chakra-panel";
  panel.style.cssText = `
    position: fixed;
    top: 0;
    right: -${PANEL_WIDTH}px;
    width: ${PANEL_WIDTH}px;
    height: 100vh;
    overflow: hidden;
    transition: right 0.3s ease-in-out;
    font-family: monospace;
    z-index: 2147483646;
    display: flex;
    flex-direction: column;
    border-left: 1px solid transparent;
  `;
  document.body.appendChild(panel);

  const inner = document.createElement("div");
  inner.style.cssText = `
    padding: 60px 16px 16px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  `;
  inner.addEventListener("scroll", () => {
    localStorage.setItem("chakra-scroll", String(inner.scrollTop));
  });
  panel.appendChild(inner);

  const resizer = document.createElement("div");
  resizer.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
    z-index: 10;
  `;
  panel.appendChild(resizer);

  const toggle = document.createElement("div");
  toggle.id = "chakra-toggle";
  toggle.style.cssText = `
    position: fixed;
    top: 50%;
    right: 0;
    width: 40px;
    height: 40px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 6px 0 0 6px;
    user-select: none;
    box-shadow: -1px 0 4px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
    transition: right 0.3s ease-in-out;
    padding: 4px;
    background: #ddd;
    color: #000;
  `;
  document.body.appendChild(toggle);

  // Chakra icon with 180° hover animation
  toggle.innerHTML = `
    <style>
      #chakra-toggle svg {
        transform: rotate(90deg);
        transition: transform 0.4s ease;
      }
      #chakra-toggle:hover svg {
        transform: rotate(270deg);
      }
    </style>
    <svg viewBox="0 0 768 768" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" stroke-width="16">
        <circle cx="384" cy="384" r="256"/>
        <circle cx="384" cy="384" r="192"/>
        <circle cx="384" cy="384" r="48"/>
        <g stroke-width="12">
          ${[
            [384, 128],
            [384, 640],
            [128, 384],
            [640, 384],
            [192, 192],
            [576, 576],
            [576, 192],
            [192, 576],
            [256, 128],
            [512, 128],
            [128, 256],
            [128, 512],
            [640, 256],
            [640, 512],
            [256, 640],
            [512, 640],
          ]
            .map(
              ([x2, y2]) => `<line x1="384" y1="384" x2="${x2}" y2="${y2}"/>`
            )
            .join("")}
        </g>
        <g stroke-width="24" stroke-linecap="round">
          <line x1="384" y1="64" x2="384" y2="128"/>
          <line x1="384" y1="704" x2="384" y2="640"/>
          <line x1="64" y1="384" x2="128" y2="384"/>
          <line x1="704" y1="384" x2="640" y2="384"/>
          <line x1="160" y1="160" x2="192" y2="192"/>
          <line x1="608" y1="608" x2="576" y2="576"/>
          <line x1="608" y1="160" x2="576" y2="192"/>
          <line x1="160" y1="608" x2="192" y2="576"/>
        </g>
      </g>
    </svg>
  `;

  const title = document.createElement("h2");
  title.textContent = "Notebook Cells";
  title.style.marginTop = "0";
  inner.appendChild(title);

  const container = document.createElement("div");
  container.id = "chakra-output";
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 16px;
    box-sizing: border-box;
  `;
  inner.appendChild(container);

  let isOpen = localStorage.getItem("colab-md-open") === "true";

  function layout() {
    requestAnimationFrame(() => {
      panel.style.right = isOpen ? "0px" : `-${PANEL_WIDTH}px`;
      panel.style.width = `${PANEL_WIDTH}px`;
      toggle.style.right = isOpen ? `${PANEL_WIDTH}px` : "0px";
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close Viewer" : "Open Viewer"
      );
      localStorage.setItem("colab-md-open", String(isOpen));
      if (isOpen) {
        requestAnimationFrame(() => {
          inner.scrollTop = scrollY;
        });
      }
    });
  }

  toggle.onclick = () => {
    isOpen = !isOpen;
    layout();
  };

  function applyTheme() {
    const theme = document.documentElement.getAttribute("theme");
    const dark = theme === "dark";
    const bg = dark ? "#1e1e1e" : "#f4f4f4";
    const fg = dark ? "#f0f0f0" : "#000000";
    const border = dark ? "1px solid #444" : "1px solid #ccc";
    const btnBg = dark ? "#555" : "#ddd";
    const btnFg = dark ? "#fff" : "#000";

    inner.style.backgroundColor = bg;
    inner.style.color = fg;
    container.style.backgroundColor = bg;
    toggle.style.backgroundColor = btnBg;
    toggle.style.color = btnFg;
    panel.style.borderLeft = border;
  }

  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["theme"],
  });

  window.addEventListener("message", (ev) => {
    if (ev.source !== window) return;
    if (ev.data?.source !== "colab-markdown-extractor") return;

    container.innerHTML = "";
    const cells = ev.data.cells || [];

    cells.forEach((cell) => {
      const tile = document.createElement("div");
      tile.style.cssText = `
        background: inherit;
        color: inherit;
        border: 1px solid #9993;
        border-radius: 6px;
        padding: 12px;
        white-space: pre-wrap;
        font-family: inherit;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        margin-bottom: 0;
        overflow-x: auto;
        cursor: pointer;
      `;

      const tag = document.createElement("div");
      tag.textContent = `[${cell.type.toUpperCase()}]`;
      tag.style.cssText = `
        font-size: 11px;
        font-weight: bold;
        color: #666;
        margin-bottom: 6px;
      `;

      const body = document.createElement("div");
      const contentText = cell.content.join("\n");
      body.textContent = contentText;

      // Scroll to matching notebook cell
      tile.onclick = () => {
        const match = Array.from(
          document.querySelectorAll("colab-run-button, .cell")
        ).find((el) => el.textContent?.includes(cell.content[0]?.slice(0, 10)));
        if (match)
          match.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      tile.appendChild(tag);
      tile.appendChild(body);
      container.appendChild(tile);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
      layout();
    }
  });

  resizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    document.body.style.cursor = "ew-resize";
    const startX = e.clientX;
    const startWidth = PANEL_WIDTH;

    function onMouseMove(e) {
      const dx = startX - e.clientX;
      PANEL_WIDTH = Math.min(Math.max(startWidth + dx, 200), 800);
      localStorage.setItem("colab-md-panel-width", String(PANEL_WIDTH));
      layout();
    }

    function onMouseUp() {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });

  layout();
}
