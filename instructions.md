# 2fiat Commander

## Documentation

- [2fiat Commander README](https://github.com/nzjess/2fiat-commander/blob/main/README.md) — the upstream overview of what the app does.

## What you get on StartOS

A web interface for monitoring your 2fiat accounts. Your accounts sync on their own every 6 hours, and you can start a sync from the app at any time.

## Getting set up

1. Run **Create or Reset a User**, which StartOS asks for right after install. Enter a username, then save the password it shows you. It can't be shown again.
2. Start the service.
3. Open the **Web Interface** and log in.
4. Add your 2fiat token in the app, and run your first sync.

## Using 2fiat Commander

### Actions

**Create or Reset a User** adds a user. If the username already exists, it replaces their password and signs them out everywhere, so it's also how you recover a lost password.

**Enable Signup** lets new users create their own account from the login page, and restarts the service. It starts off, because while it's on, anyone who can reach the web interface can create a user. They can't see your accounts unless you grant them access. Run **Disable Signup** when you're done.

You can also invite someone from inside the app, with signup off.
