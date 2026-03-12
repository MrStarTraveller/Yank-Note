# Security Policy

## Supported Branch

- `main`: supported

## Security Posture

This fork changes the default security model of Yank Note:

- External files are intended to be opened in a safer, read-only flow.
- Third-party plugins and extensions are disabled by default.
- Markdown macros, runnable code blocks, HTML applets, terminal access, main-process RPC, and automatic updates are disabled by default.
- `--safe-mode` forces a stricter startup mode that blocks the high-risk capabilities above.

These controls reduce risk, but they do not guarantee complete sandboxing. This is still an Electron desktop application that can be configured to enable powerful local capabilities.

## Reporting a Vulnerability

Please report security issues privately through GitHub Security Advisories for this repository:

- [Report a vulnerability](https://github.com/MrStarTraveller/Yank-Note/security/advisories/new)

If GitHub private reporting is not available, open a private channel with the maintainer before publishing details.

## What to Include

Please include:

- affected version or commit
- operating system
- reproduction steps
- expected impact
- whether the issue requires changing security settings from defaults

## Response Goals

- acknowledge receipt within 7 days
- provide status updates during triage
- publish a fix or mitigation when ready
