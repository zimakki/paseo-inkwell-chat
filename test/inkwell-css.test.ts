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
