# Paseo Inkwell Chat

A Paseo plugin that adds color to the agent chat. Headings, bold, inline code, links, blockquotes
and list bullets each get their own color, and so does each kind of tool row (Shell, Read, Edit,
MCP tools, and so on). The palette comes from [inkwell](https://github.com/zimakki/inkwell), a
markdown renderer.

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

The colors are tuned for a dark Paseo theme. There is no light palette yet.

## Install

You need Paseo 0.10.1 or later, with plugins enabled (Settings → Plugins).

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

1. It adds one `<style id="inkwell-chat">` element. Reply markdown already carries
   `data-paseo-markdown-tag="h1|strong|code|..."` attributes, which the CSS targets directly.
2. It starts a `MutationObserver` that reads each tool row's label and writes it back as
   `data-inkwell-tool="shell"`, because CSS can't match on text. It also marks the row's label and
   header icon, so expanded details and error icons keep Paseo's colors.

Disabling or removing the plugin removes the stylesheet, stops the observer and strips every
attribute it added.

## Paseo internals it depends on

None of these are part of the plugin API. They were checked against Paseo 0.10.1. If a Paseo update
renames them, the colors disappear, but nothing breaks.

| Hook                                                                                      | Used for                                |
| ----------------------------------------------------------------------------------------- | --------------------------------------- |
| `[data-paseo-markdown-tag="h1"]` and the other tags (`strong`, `code`, `blockquote`, ...) | reply markdown                          |
| `[data-paseo-markdown-tag] a`                                                             | links, including file-path code links   |
| `[data-paseo-markdown-list-marker="true"]`                                                | list bullets                            |
| `[data-testid="tool-call-badge"]`                                                         | a tool row                              |
| first element with its own text inside a tool row                                         | the tool label (`Shell`, `Read`, ...)   |
| first `svg` inside a tool row                                                             | the tool icon, colored through `stroke` |

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
