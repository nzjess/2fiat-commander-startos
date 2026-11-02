# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

- Clone with `--recurse-submodules`. `LICENSE` and `icon.png` are symlinks into `upstream-project/`, and the build fails without it.
- Don't pass passwords to `user.ts` in argv, where the process list can see them. It reads them from stdin.
