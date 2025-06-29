(function () {
  console.log("[Colab Markdown Extractor] page-script.js running");

  const post = (cells) => {
    window.postMessage(
      {
        source: "colab-markdown-extractor",
        cells: cells || [],
      },
      "*"
    );
  };

  function parseAllCells(raw) {
    const lines = raw.split("\n");
    const cells = [];
    let current = null;

    for (const line of lines) {
      if (line.startsWith("# %% [markdown]")) {
        if (current) cells.push(current);
        current = { type: "markdown", content: [] };
      } else if (line.startsWith("# %%")) {
        if (current) cells.push(current);
        current = { type: "code", content: [] };
      } else if (current) {
        const isMd = current.type === "markdown";
        const text = isMd && line.startsWith("# ") ? line.slice(2) : line;
        current.content.push(text);
      }
    }
    if (current) cells.push(current);

    return cells.filter((c) => c.content.length > 0);
  }

  function waitForMonaco(attempts = 20) {
    const models = window.monaco?.editor?.getModels?.();
    if (models?.length) {
      const raw = models[0].getValue();
      const cells = parseAllCells(raw);
      post(cells);
    } else if (attempts > 0) {
      setTimeout(() => waitForMonaco(attempts - 1), 300);
    } else {
      console.warn(
        "[Colab Markdown Extractor] Monaco not available after retries"
      );
      post([{ type: "error", content: ["⚠️ Could not extract any cells"] }]);
    }
  }

  waitForMonaco();
})();
