// Tool row labels come from Paseo's packages/protocol/src/tool-call-display.ts.
export const TOOL_KEYS: readonly string[] = [
  "shell",
  "read",
  "edit",
  "write",
  "search",
  "fetch",
  "terminal",
  "task",
  "plan",
  "thinking",
  "worktree-setup",
  "skill",
  "mcp",
];

export function toolKeyFromLabel(label: string): string | null {
  // MCP tool rows show the raw tool name, such as mcp__chrome-devtools__click.
  if (label.trim().startsWith("mcp__")) return "mcp";
  const key = label.trim().toLowerCase().replace(/\s+/g, "-");
  return TOOL_KEYS.includes(key) ? key : null;
}
