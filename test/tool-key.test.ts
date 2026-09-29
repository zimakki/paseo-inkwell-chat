import assert from "node:assert/strict";
import { test } from "node:test";
import { TOOL_KEYS, toolKeyFromLabel } from "../shared/tool-key.ts";

test("maps each Paseo label to its key", () => {
  assert.equal(toolKeyFromLabel("Shell"), "shell");
  assert.equal(toolKeyFromLabel("Read"), "read");
  assert.equal(toolKeyFromLabel("Edit"), "edit");
  assert.equal(toolKeyFromLabel("Write"), "write");
  assert.equal(toolKeyFromLabel("Search"), "search");
  assert.equal(toolKeyFromLabel("Fetch"), "fetch");
  assert.equal(toolKeyFromLabel("Terminal"), "terminal");
  assert.equal(toolKeyFromLabel("Task"), "task");
  assert.equal(toolKeyFromLabel("Plan"), "plan");
  assert.equal(toolKeyFromLabel("Thinking"), "thinking");
  assert.equal(toolKeyFromLabel("Worktree setup"), "worktree-setup");
  assert.equal(toolKeyFromLabel("Skill"), "skill");
});

test("maps every MCP tool row to one key", () => {
  assert.equal(toolKeyFromLabel("mcp__chrome-devtools__click"), "mcp");
  assert.equal(toolKeyFromLabel(" mcp__paseo__list_agents "), "mcp");
  assert.equal(toolKeyFromLabel("Mcp tools"), null);
});

test("ignores surrounding whitespace and case", () => {
  assert.equal(toolKeyFromLabel("  Shell \n"), "shell");
  assert.equal(toolKeyFromLabel("WORKTREE   SETUP"), "worktree-setup");
});

test("returns null for labels it does not know", () => {
  assert.equal(toolKeyFromLabel(""), null);
  assert.equal(toolKeyFromLabel("Explore"), null);
  assert.equal(toolKeyFromLabel("Create agent"), null);
  assert.equal(toolKeyFromLabel("Readme"), null);
  assert.equal(toolKeyFromLabel("Shell npm test"), null);
  assert.equal(toolKeyFromLabel("Lesen"), null);
});

test("every key except mcp maps back to itself", () => {
  for (const key of TOOL_KEYS.filter((k) => k !== "mcp"))
    assert.equal(toolKeyFromLabel(key.replace(/-/g, " ")), key);
});
