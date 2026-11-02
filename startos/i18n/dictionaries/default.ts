export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting 2fiat Commander!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,

  // interfaces.ts
  'The 2fiat Commander web app': 4,

  // actions/createOrResetUser.ts
  Username: 5,
  'The user to create, or the existing user to reset': 6,
  'Use only letters, numbers, dots, underscores and hyphens': 7,
  'Create or Reset a User': 8,
  'Creates a user with a generated password. If the username already exists, replaces their password and signs them out everywhere.': 9,
  'User Ready': 10,
  'Save this password now. It is not stored anywhere and cannot be shown again.': 11,
  Password: 12,

  // init/watchFirstUser.ts
  'Create the first user, so you can log in': 13,

  // actions/toggleSignup.ts
  'Enable Signup': 14,
  'Disable Signup': 15,
  'Lets new users sign up from the login page. Restarts the service if it is running.': 16,
  'Stops new users signing up from the login page. Existing users are not affected. Restarts the service if it is running.': 17,
  'Anyone who can reach the web interface will be able to create a user.': 18,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
