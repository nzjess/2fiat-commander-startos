<p align="center">
  <img src="icon.png" alt="2fiat Commander Logo" width="21%">
</p>

# 2fiat Commander on StartOS

> Everything not listed in this document should behave the same as upstream 2fiat Commander.
> If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section of
> `instructions.md` for links.

2fiat Commander is a read-only monitor for [2fiat](https://2fiat.com) virtual card accounts. The upstream project is [nzjess/2fiat-commander](https://github.com/nzjess/2fiat-commander).

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The image is built by this repo's `Dockerfile` from the app source in the `upstream-project/` submodule, keeping its pnpm workspace layout, because Node runs the server's TypeScript directly and refuses to strip types under `node_modules`.

| Item          | Value                                       |
| ------------- | ------------------------------------------- |
| Image source  | Custom Dockerfile, built from the submodule |
| Architectures | x86_64                                      |
| Entrypoint    | `node apps/server/src/main.ts`, from `/app` |

The `main` subcontainer runs the one daemon, which serves both the API and the built web app. The `create-or-reset-user` subcontainer exists only while that action runs.

## Volume and Data Layout

The app's data is on `main`. The package's own state, including the secret that decrypts the stored 2fiat tokens, is on `startos`.

| Volume    | Mount point | Contents                                                                                                          |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `main`    | `/data`     | `commander.db` (embedded SQLite), `pre-migration/` (the newest 3 database copies taken before a schema migration) |
| `startos` | None        | `store.json`, which no subcontainer mounts                                                                        |

## File Models

The package owns one file, `store.json` on the `startos` volume. It is StartOS-side state rather than upstream configuration, and it is never printed.

| Key                | Seeded                     | Rewritten by                                        |
| ------------------ | -------------------------- | --------------------------------------------------- |
| `appSecret`        | Generated once, on install | Nothing. Changing it loses the stored 2fiat tokens. |
| `signupEnabled`    | `false`                    | Flipped by **Enable Signup** / **Disable Signup**   |
| `firstUserCreated` | `false`                    | Set to `true` by **Create or Reset a User**         |

Upstream takes its configuration from environment variables, re-read on every launch. The package sets `HOST`, `PORT`, `DATABASE_PATH`, `WEB_DIST` and `SYNC_INTERVAL_MINUTES` as fixed values, and `APP_SECRET` and `SIGNUP_ENABLED` from `store.json`. Changing either of those two restarts the daemon. `firstUserCreated` does not.

## Dependencies

None.

## Network Access and Interfaces

The package exposes one interface.

| Id   | Type | Port | Protocol | Purpose                 |
| ---- | ---- | ---- | -------- | ----------------------- |
| `ui` | `ui` | 3000 | HTTP     | The web app and its API |

The binding requests HTTPS port 3443 and falls back to a dynamic port if that's taken. A fresh install or a restore allocates the port again, and an update keeps the one it holds. The binding offers HTTPS addresses only. A plain port is assigned to it, but StartOS doesn't publish that port on the LAN, so the app's `Secure` session cookie works on every address offered.

## Installation and First-Run Flow

Upstream's first user can come from the signup page. Here signup starts off, so that whoever reaches the address first can't claim the instance. Install generates `appSecret` and raises a critical task, and the service can't start until **Create or Reset a User** has run.

## Actions

The package has two user-facing actions.

**Create or Reset a User**

- **When to run it**: for the first user, to add another, or when a password is lost.
- **What it changes**: creates the user in `commander.db`, or replaces their password and ends their sessions if the username exists. Sets `firstUserCreated`.
- **Cost**: seconds, without interrupting the service. It can run while the service is stopped.
- **Repeat safety**: each run on an existing username replaces that user's password.
- **Outputs**: the username and a generated password, shown once and stored only as a hash.

**Enable Signup** / **Disable Signup** (one action, named for what it will do)

- **When to run it**: to let someone create their own user from the login page, then again to close it. Owners can also invite users from inside the app, with signup off.
- **What it changes**: flips `signupEnabled`. A user who signs up has no access to any account until they add one or are granted access.
- **Cost**: restarts the service if it's running, which takes seconds.
- **Repeat safety**: each run flips the setting back.

## Tasks

The package creates one task.

| Task                           | Raised when                   | Severity | Cleared by                                                   |
| ------------------------------ | ----------------------------- | -------- | ------------------------------------------------------------ |
| Run **Create or Reset a User** | `firstUserCreated` is not set | critical | Running the action. It does not return once the flag is set. |

A restore brings back `firstUserCreated`, so restoring an instance that already has a user raises no task.

## Health Checks

The `main` daemon has one check, **Web Interface**, which fetches `/api/health` from inside the container and passes on any HTTP response, with the SDK's default 10-second grace period. The first check on a start can run just before the server listens, so the log may show one `ECONNREFUSED` for it: that's expected. A later failure usually means the server is still migrating its database. If it persists, read the service log: a failed migration leaves the database as it was and stops the server from starting.

## Backups and Restore

The `main` and `startos` volumes are copied whole, with the service stopped, so the database and `appSecret` are both captured and a restored instance can read its stored 2fiat tokens. That also means anyone holding the backup and its password holds the secret. Nothing is excluded, including the newest 3 `pre-migration/` copies, and nothing has to be rebuilt after a restore. A restore returns users, passwords and sessions to how they were when the backup was taken, so a password reset made since then is undone. Run **Create or Reset a User** again if that matters.

## Limitations and Differences

1. Only x86_64 is built.
2. Signup starts off, where upstream starts on.
3. Syncs run every 6 hours, and the interval can't be changed.
4. Upstream's daily backup (`BACKUP_DIR`) isn't used. StartOS backups cover the data.

---

## Quick Reference for AI Consumers

```yaml
package_id: '2fiat-commander'
image: built from upstream-project/ by the root Dockerfile
architectures: [x86_64]
subcontainers: [main, create-or-reset-user]
volumes:
  main: /data
  startos: null
file_models:
  - store.json
startos_managed_env_vars:
  - HOST
  - PORT
  - DATABASE_PATH
  - WEB_DIST
  - SYNC_INTERVAL_MINUTES
  - SIGNUP_ENABLED
  - APP_SECRET
dependencies: none
interfaces:
  ui: { type: ui, port: 3000 }
actions:
  - create-or-reset-user
  - toggle-signup
tasks:
  - { action: create-or-reset-user, severity: critical }
health_checks:
  - main
```
