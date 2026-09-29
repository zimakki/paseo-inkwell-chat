// The stylesheet Zi approved live in Chrome on 2026-09-29. Edit it here, then run
// `paseo plugin reload paseo-inkwell-chat`.
export const INKWELL_CSS: string = `
:root {
  --ink-h1: #f0c674;
  --ink-h2: #7aa2f7;
  --ink-h3: #73daca;
  --ink-h4: #bb9af7;
  --ink-bold: #e0af68;
  --ink-code: #ff9e64;
  --ink-code-bg: #24283b;
  --ink-code-border: #2f334d;
  --ink-link: #7dcfff;
  --ink-quote-bar: #ff757f;
  --ink-quote-bg: rgba(255, 117, 127, 0.06);
  --ink-bullet: #565f89;
  --ink-tool-shell: #9ece6a;
  --ink-tool-read: #7dcfff;
  --ink-tool-edit: #e0af68;
  --ink-tool-write: #ff9e64;
  --ink-tool-search: #bb9af7;
  --ink-tool-fetch: #73daca;
  --ink-tool-terminal: #2ac3de;
  --ink-tool-task: #f7768e;
  --ink-tool-plan: #7aa2f7;
  --ink-tool-thinking: #565f89;
  --ink-tool-worktree-setup: #c3e88d;
  --ink-tool-skill: #ff007c;
  --ink-tool-mcp: #41a6b5;
}

[data-paseo-markdown-tag="h1"],
[data-paseo-markdown-tag="h1"] * { color: var(--ink-h1) !important; }
[data-paseo-markdown-tag="h2"],
[data-paseo-markdown-tag="h2"] * { color: var(--ink-h2) !important; }
[data-paseo-markdown-tag="h3"],
[data-paseo-markdown-tag="h3"] * { color: var(--ink-h3) !important; }
[data-paseo-markdown-tag="h4"],
[data-paseo-markdown-tag="h4"] * { color: var(--ink-h4) !important; }

[data-paseo-markdown-tag="strong"],
[data-paseo-markdown-tag="strong"] * { color: var(--ink-bold) !important; }

[data-paseo-markdown-tag="code"] {
  color: var(--ink-code) !important;
  background-color: var(--ink-code-bg) !important;
  border: 1px solid var(--ink-code-border) !important;
  border-radius: 4px !important;
  padding: 0 4px !important;
}

[data-paseo-markdown-tag] a,
[data-paseo-markdown-tag] a * { color: var(--ink-link) !important; }

[data-paseo-markdown-tag="blockquote"] {
  border-left: 3px solid var(--ink-quote-bar) !important;
  background-color: var(--ink-quote-bg) !important;
}

[data-paseo-markdown-list-marker="true"] { color: var(--ink-bullet) !important; }

[data-inkwell-tool="shell"] { --ink-tool: var(--ink-tool-shell); }
[data-inkwell-tool="read"] { --ink-tool: var(--ink-tool-read); }
[data-inkwell-tool="edit"] { --ink-tool: var(--ink-tool-edit); }
[data-inkwell-tool="write"] { --ink-tool: var(--ink-tool-write); }
[data-inkwell-tool="search"] { --ink-tool: var(--ink-tool-search); }
[data-inkwell-tool="fetch"] { --ink-tool: var(--ink-tool-fetch); }
[data-inkwell-tool="terminal"] { --ink-tool: var(--ink-tool-terminal); }
[data-inkwell-tool="task"] { --ink-tool: var(--ink-tool-task); }
[data-inkwell-tool="plan"] { --ink-tool: var(--ink-tool-plan); }
[data-inkwell-tool="thinking"] { --ink-tool: var(--ink-tool-thinking); }
[data-inkwell-tool="worktree-setup"] { --ink-tool: var(--ink-tool-worktree-setup); }
[data-inkwell-tool="skill"] { --ink-tool: var(--ink-tool-skill); }
[data-inkwell-tool="mcp"] { --ink-tool: var(--ink-tool-mcp); }

[data-inkwell-tool] [data-inkwell-label] { color: var(--ink-tool) !important; }
[data-inkwell-tool] [data-inkwell-icon],
[data-inkwell-tool] [data-inkwell-icon] * { color: var(--ink-tool) !important; stroke: var(--ink-tool) !important; }
`;
