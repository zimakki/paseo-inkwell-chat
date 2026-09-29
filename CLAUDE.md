# Paseo Inkwell Chat

A Paseo plugin that colors chat replies and tool rows by injecting CSS into Paseo's own DOM. It is
not published to npm or paseo.cafe. The source is public at
https://github.com/zimakki/paseo-inkwell-chat.

- `README.md` explains what it colors, how it works, and the Paseo DOM hooks it depends on.
- Run `npm run check` before committing. The lefthook pre-commit hook runs the same checks.
- After a source edit, run `paseo plugin reload paseo-inkwell-chat`. Never restart the Paseo daemon
  without asking Zi. A restart stops every running agent.
- To check a change live, use the daemon's web UI. See "Testing live in a browser" in `README.md`.
  Turning it on or off needs a daemon restart, so ask Zi to do both.
- DOM globals belong only in `client/web.ts`, declared locally, and must be gated on
  `Platform.OS === "web"`. Don't add `"DOM"` to `tsconfig.json`.
- Stage explicit paths in git. Never `git add -A`, because other agents may share the working tree.
- Push only when Zi asks.
