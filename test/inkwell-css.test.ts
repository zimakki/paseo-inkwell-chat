import assert from "node:assert/strict";
import { test } from "node:test";
import { INKWELL_CSS } from "../shared/inkwell-css.ts";
import { TOOL_KEYS } from "../shared/tool-key.ts";

test("only colors tool keys the tagger can write", () => {
  const used = [...INKWELL_CSS.matchAll(/data-inkwell-tool="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(used.length > 0);
  for (const key of used) assert.ok(TOOL_KEYS.includes(key), `unknown tool key in CSS: ${key}`);
});

test("gives every tool key a color", () => {
  for (const key of TOOL_KEYS) {
    assert.ok(
      INKWELL_CSS.includes(`[data-inkwell-tool="${key}"]`),
      `no color for tool key: ${key}`,
    );
  }
});

test("targets markdown by element, since Paseo 0.12 only tags code blocks", () => {
  const tags = [...INKWELL_CSS.matchAll(/data-paseo-markdown-tag="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(tags)], ["pre"]);
  assert.ok(!INKWELL_CSS.includes("data-paseo-markdown-list-marker"));
});

interface Rule {
  selectors: string[];
  body: string;
}

// Splits a selector list on commas outside parentheses, so :is(a, b) stays whole.
function splitSelectors(list: string): string[] {
  const selectors: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of list) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      selectors.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  selectors.push(current.trim());
  return selectors;
}

function rules(css: string): Rule[] {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("}")
    .map((chunk) => chunk.split("{"))
    .filter((parts) => parts.length === 2)
    .map(([selectors, body]) => ({ selectors: splitSelectors(selectors), body: body.trim() }));
}

function rulesFor(selector: string): Rule[] {
  return rules(INKWELL_CSS).filter((rule) => rule.selectors.includes(selector));
}

// Paseo 0.14: user-message > content > bubble (holds [data-message-text]) and a trailing row.
// A message another agent sent also has a sender button as the content's first child.
const YOURS = '[data-testid="user-message"]:not(:has(> div > :is(button, [role="button"])))';

test("defines the color for your messages", () => {
  assert.match(INKWELL_CSS, /--ink-you: #fab387;/);
});

test("fills and outlines the bubble of your own messages in your color", () => {
  const [bubble] = rulesFor(`${YOURS} > div > div:has([data-message-text])`);
  assert.ok(bubble, "no rule for your message bubble");
  assert.match(bubble.body, /background-color: color-mix\([^)]*var\(--ink-you\)[^)]*\) !important/);
  assert.match(bubble.body, /border: [^;]*var\(--ink-you\)[^;]*!important/);
});

test("labels your own messages", () => {
  const [label] = rulesFor(`${YOURS} > div::before`);
  assert.ok(label, "no label rule for your messages");
  assert.match(label.body, /content: "You"/);
  assert.match(label.body, /color: var\(--ink-you\)/);
});

test("leaves messages another agent sent alone", () => {
  const touchingMessages = rules(INKWELL_CSS)
    .flatMap((rule) => rule.selectors)
    .filter((selector) => selector.includes('[data-testid="user-message"]'));
  assert.ok(touchingMessages.length > 0);
  for (const selector of touchingMessages) assert.ok(selector.startsWith(YOURS), selector);
});

test("drops the box around open Thinking and dims its text", () => {
  const [header] = rulesFor('[data-inkwell-tool="thinking"] > button');
  assert.ok(header, "no rule for the Thinking header");
  assert.match(header.body, /background-color: transparent !important/);
  const [body] = rulesFor('[data-inkwell-tool="thinking"] > :not(button)');
  assert.ok(body, "no rule for the open Thinking body");
  assert.match(body.body, /border: 0 !important/);
  assert.match(body.body, /border-left: 2px solid/);
  const [text] = rulesFor('[data-inkwell-tool="thinking"] > :not(button) *');
  assert.ok(text, "no rule for the Thinking text");
  assert.match(text.body, /background-color: transparent !important/);
  assert.match(text.body, /font-style: italic !important/);
});

test("colors the outline rail dashes, with the current one solid", () => {
  const [dash] = rulesFor('[data-testid^="chat-outline-tick-"] > div');
  assert.ok(dash, "no rule for outline dashes");
  assert.match(dash.body, /background-color: color-mix\([^)]*var\(--ink-you\)/);
  const [current] = rulesFor('[data-testid^="chat-outline-tick-"][aria-selected="true"] > div');
  assert.ok(current, "no rule for the current outline dash");
  assert.match(current.body, /background-color: var\(--ink-you\) !important/);
});
