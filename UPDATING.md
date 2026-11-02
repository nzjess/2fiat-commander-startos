# Updating the upstream version

Upstream is the 2fiat Commander app, pinned as the git submodule at `upstream-project/`. The root `Dockerfile` builds the image from that commit.

## Determining the upstream version

The pin is the submodule's commit: `git submodule status upstream-project`. The latest is the head of `main` at <https://github.com/nzjess/2fiat-commander>.

## Applying the bump

1. Make and push the change in the app's own repo, never in the submodule.
2. Move the pin: `git -C upstream-project fetch && git -C upstream-project checkout <commit>`, then `git add upstream-project`.
3. Set `version` and `releaseNotes` in `startos/versions/current.ts`. Versions read `<app>:<package revision>`.
4. If the app's Node or pnpm pin changed, update the `FROM` and `npm install -g pnpm@` lines in the `Dockerfile` to match its `.prototools`.

The app migrates its own database on startup, so a bump needs no package migration for that.
