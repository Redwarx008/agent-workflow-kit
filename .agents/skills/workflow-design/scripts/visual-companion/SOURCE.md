# Upstream Source

This tool is derived from the Visual Brainstorming Companion in
[`obra/superpowers`](https://github.com/obra/superpowers) version 6.1.1 at commit
`d884ae04edebef577e82ff7c4e143debd0bbec99`.

Derived files:

- `server.cjs`
- `helper.js`
- `frame-template.html`
- `start.sh`
- `stop.sh`

Local adaptations rename the UI, remove remote branding/telemetry, store state
under `workflow/.local/visual/`, expose `session_dir` in startup JSON, and add
native PowerShell lifecycle scripts. Authentication, origin checks, file
containment, token fallback, reconnect, idle timeout, and process ownership
semantics remain based on the upstream implementation.

The upstream MIT license is retained in `LICENSE.superpowers`.
