import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { appDir, databasePath, dataMounts } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  username: Value.text({
    name: i18n('Username'),
    description: i18n('The user to create, or the existing user to reset'),
    required: true,
    default: null,
    patterns: [
      {
        regex: '^[A-Za-z0-9._-]+$',
        description: i18n(
          'Use only letters, numbers, dots, underscores and hyphens',
        ),
      },
    ],
  }),
})

export const createOrResetUser = sdk.Action.withInput(
  'create-or-reset-user',
  async () => ({
    name: i18n('Create or Reset a User'),
    description: i18n(
      'Creates a user with a generated password. If the username already exists, replaces their password and signs them out everywhere.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async () => null,
  async ({ effects, input }) => {
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 24,
    })

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'main' },
      dataMounts,
      'create-or-reset-user',
      (sub) =>
        sub.execFail(
          ['node', 'apps/server/scripts/user.ts', 'set', input.username],
          {
            cwd: appDir,
            env: { DATABASE_PATH: databasePath },
            input: `${password}\n`,
            timeout: 120_000,
          },
        ),
    )

    await storeJson.merge(effects, { firstUserCreated: true })

    return {
      version: '1',
      title: i18n('User Ready'),
      message: i18n(
        'Save this password now. It is not stored anywhere and cannot be shown again.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: input.username,
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
