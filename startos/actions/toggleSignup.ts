import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const toggleSignup = sdk.Action.withoutInput(
  'toggle-signup',
  async ({ effects }) => {
    const enabled = await storeJson.read((s) => s.signupEnabled).const(effects)
    return {
      name: enabled ? i18n('Disable Signup') : i18n('Enable Signup'),
      description: enabled
        ? i18n(
            'Stops new users signing up from the login page. Existing users are not affected. Restarts the service if it is running.',
          )
        : i18n(
            'Lets new users sign up from the login page. Restarts the service if it is running.',
          ),
      warning: enabled
        ? null
        : i18n(
            'Anyone who can reach the web interface will be able to create a user.',
          ),
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },
  async ({ effects }) => {
    const enabled = await storeJson.read((s) => s.signupEnabled).once()
    await storeJson.merge(effects, { signupEnabled: !enabled })
    return null
  },
)
