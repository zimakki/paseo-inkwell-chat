# Paseo Inkwell Chat

A Paseo plugin that adds color to the agent chat. Headings, bold, inline code, links, blockquotes
and list bullets each get their own color, and so does each kind of tool row (Shell, Read, Edit,
MCP tools, and so on). Your own messages get a color of their own and open Thinking blocks fade
back, so your last message is easy to find when you scroll up. The palette comes from
[inkwell](https://github.com/zimakki/inkwell), a markdown renderer.

Paseo draws all of that in one foreground color, which makes a long agent reply slow to scan.
This plugin fixes that without redrawing anything. It injects a stylesheet into Paseo's own page,
so file links, Cmd+F, copy, code highlighting and the tool detail sheet keep working as before.

## What it colors

| Element                               | Color                                           |
| ------------------------------------- | ----------------------------------------------- |
| H1 / H2 / H3 / H4                     | `#f0c674` / `#7aa2f7` / `#73daca` / `#bb9af7`   |
| Bold                                  | `#e0af68`                                       |
| Inline code                           | `#ff9e64` on `#24283b`                          |
| Links, including file-path code links | `#7dcfff`                                       |
| Blockquote bar                        | `#ff757f`                                       |
| List bullets                          | `#565f89`                                       |
| Tool rows                             | one color per tool, for the icon and label only |
| Your messages                         | `#fab387` fill, outline and "You" label         |
| Chat outline dashes                   | `#fab387`, solid for the current message        |
| Open Thinking                         | no box, dim italic `#7f849c` text               |

The colors are tuned for a dark Paseo theme. There is no light palette yet. Messages another agent
sent you keep Paseo's look, so only what you typed is peach.

## Install

You need Paseo 0.12.0 or later, with plugins enabled (Settings → Plugins).

```bash
git clone https://github.com/zimakki/paseo-inkwell-chat.git
cd paseo-inkwell-chat
npm install
paseo plugin install "$PWD"
paseo plugin ls   # paseo-inkwell-chat should show "running"
```

Reload the Paseo window if it was open during the install. It works in the desktop app and the
web UI. On iOS and Android it does nothing.

## How it works

`client/web.ts` does two things when the plugin starts:

1. It adds one `<style id="inkwell-chat">` element. Paseo renders reply markdown as plain HTML
   (`h1`, `strong`, `code`, `a`, ...) inside each assistant message, and the CSS targets those
   elements.
2. It starts a `MutationObserver` that reads each tool row's label and writes it back as
   `data-inkwell-tool="shell"`, because CSS can't match on text. It also marks the row's label and
   header icon, so expanded details and error icons keep Paseo's colors.

Disabling or removing the plugin removes the stylesheet, stops the observer and strips every
attribute it added.

## Paseo internals it depends on

None of these are part of the plugin API. They were checked against Paseo 0.12.0. If a Paseo update
renames them, the colors disappear, but nothing breaks.

| Hook                                                         | Used for                                |
| ------------------------------------------------------------ | --------------------------------------- |
| `[data-testid="assistant-message"]`                          | scopes every markdown rule to replies   |
| `h1`–`h4`, `strong`, `code`, `a`, `blockquote`, `li::marker` | reply markdown                          |
| `pre` and `[data-paseo-markdown-tag="pre"]`                  | fenced code blocks, left uncolored      |
| `[data-testid="tool-call-badge"]`                            | a tool row                              |
| first element with its own text inside a tool row            | the tool label (`Shell`, `Read`, ...)   |
| first `svg` inside a tool row                                | the tool icon, colored through `stroke` |
| `[data-testid="user-message"]` > content > bubble            | your messages                           |
| the bubble holds `[data-message-text]`                       | finds the bubble inside the message     |
| a `button` as a direct child of the message content          | marks a message another agent sent      |
| a Thinking row's header `button` and its second child        | the open Thinking body                  |
| `[data-testid^="chat-outline-tick-"]` with `aria-selected`   | the chat outline dashes                 |

Since 0.12, rows for Paseo's own MCP tools show friendly labels such as `Run JavaScript` instead
of `mcp__paseo__*`. `shared/tool-key.ts` lists them, copied from `PASEO_TOOL_CATALOG` in Paseo's
app bundle, so a new Paseo tool stays uncolored until it's added there.

A non-English Paseo UI shows different tool labels, so tool rows stay uncolored. So do labels the
plugin doesn't know, such as `Explore`.

## Changing the colors

The stylesheet is `shared/inkwell-css.ts`. Edit it, then check and reload:

```bash
npm run check
paseo plugin reload paseo-inkwell-chat
```

To add a color for another tool, add its key to `shared/tool-key.ts` and a
`[data-inkwell-tool="<key>"]` rule to the stylesheet. A test fails if either side is missing.

## Development

The tooling follows Paseo's own: oxfmt, oxlint, knip, tsc, and a lefthook pre-commit hook.

```bash
npm install          # also installs the pre-commit hook
npm run check        # format check, lint, knip, typecheck, tests
npm run format       # fix formatting
npm run lint:fix     # fix lint issues oxlint can fix
paseo plugin logs paseo-inkwell-chat
```

Tests use `node:test` with Node's built-in type stripping, so they need Node 22.18 or later and no
DOM.

### Testing live in a browser

To try CSS or inspect Paseo's DOM without rebuilding the plugin, turn on the web UI the daemon can
serve. It runs the same app and the same plugins as the desktop window, so you can inject scripts
into it, read the DOM and take screenshots. It is off by default.

```bash
paseo daemon config set features.webUi.enabled true
paseo daemon restart   # Paseo 0.12.0 still applies this setting only on restart
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:6767/   # 200 once it is on
```

The restart stops every running agent, including the one asking for it. Only restart at a point
where that's safe. Agents working in this repo must ask Zi, not restart it themselves.

Open `http://127.0.0.1:6767/`, or go straight to one chat at
`http://127.0.0.1:6767/h/<serverId>/agent/<agentId>`. `paseo daemon status --json` prints the
server ID, and `paseo ls` lists agents. To make fresh tool rows to test against, have an agent
write and then edit a throwaway file in `/tmp`.

An agent can drive the page in two ways:

- The Chrome DevTools MCP in `.mcp.json`. It uses one fixed profile, `.chrome-devtools-profile/`,
  so only one agent can hold it at a time. "The browser is already running" means another agent
  has it.
- Paseo's own browser tools (`browser_new_tab`, `browser_evaluate`, `browser_screenshot`,
  `browser_click`). They open a tab inside Paseo, where you can watch it. `browser_click` sends a
  real click, and `element.click()` inside `browser_evaluate` does not.

Turn the web UI off again when you are done:

```bash
paseo daemon config unset features.webUi
paseo daemon restart
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:6767/   # 404 once it is off
```
