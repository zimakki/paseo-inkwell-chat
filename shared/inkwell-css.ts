// The stylesheet Zi approved live in Chrome on 2026-09-29, retargeted for Paseo 0.12.0. Edit it
// here, then run `paseo plugin reload paseo-inkwell-chat`.
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
  --ink-you: #fab387;
  --ink-thinking-text: #7f849c;
  --ink-thinking-line: #45475a;
}

[data-testid="assistant-message"] h1,
[data-testid="assistant-message"] h1 * { color: var(--ink-h1) !important; }
[data-testid="assistant-message"] h2,
[data-testid="assistant-message"] h2 * { color: var(--ink-h2) !important; }
[data-testid="assistant-message"] h3,
[data-testid="assistant-message"] h3 * { color: var(--ink-h3) !important; }
[data-testid="assistant-message"] h4,
[data-testid="assistant-message"] h4 * { color: var(--ink-h4) !important; }

[data-testid="assistant-message"] strong,
[data-testid="assistant-message"] strong * { color: var(--ink-bold) !important; }

/* Inline code only. :where() keeps the specificity low so the link rule below still wins. */
[data-testid="assistant-message"] code:not(:where(pre *, [data-paseo-markdown-tag="pre"] *)) {
  color: var(--ink-code) !important;
  background-color: var(--ink-code-bg) !important;
  border: 1px solid var(--ink-code-border) !important;
  border-radius: 4px !important;
  padding: 0 4px !important;
}

[data-testid="assistant-message"] a,
[data-testid="assistant-message"] a * { color: var(--ink-link) !important; }

[data-testid="assistant-message"] blockquote {
  border-left: 3px solid var(--ink-quote-bar) !important;
  background-color: var(--ink-quote-bg) !important;
}

[data-testid="assistant-message"] li::marker { color: var(--ink-bullet) !important; }

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

/* Your own messages: user-message > content > bubble. A message another agent sent also has a
   sender button in its content, so it keeps Paseo's look. */
[data-testid="user-message"]:not(:has(> div > :is(button, [role="button"]))) > div > div:has([data-message-text]) {
  background-color: color-mix(in srgb, var(--ink-you) 17%, transparent) !important;
  border: 1.5px solid color-mix(in srgb, var(--ink-you) 75%, transparent) !important;
}
[data-testid="user-message"]:not(:has(> div > :is(button, [role="button"]))) > div::before {
  content: "You";
  color: var(--ink-you);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 6px;
  padding-right: 4px;
}

/* Open Thinking reads as background: no box, dim italic text, a line down the left. */
[data-inkwell-tool="thinking"] > button {
  background-color: transparent !important;
  border-color: transparent !important;
}
[data-inkwell-tool="thinking"] > :not(button) {
  border: 0 !important;
  border-left: 2px solid var(--ink-thinking-line) !important;
  border-radius: 0 !important;
  margin-left: 12px !important;
}
[data-inkwell-tool="thinking"] > :not(button) * {
  background-color: transparent !important;
  color: var(--ink-thinking-text) !important;
  font-style: italic !important;
}

/* Outline rail, one dash per message you sent: soft in your color, the current one solid. */
[data-testid^="chat-outline-tick-"] > div {
  background-color: color-mix(in srgb, var(--ink-you) 45%, transparent) !important;
}
[data-testid^="chat-outline-tick-"][aria-selected="true"] > div,
[data-testid^="chat-outline-tick-"]:hover > div {
  background-color: var(--ink-you) !important;
}
`;
