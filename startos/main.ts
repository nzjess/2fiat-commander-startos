import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { appDir, databasePath, dataMounts, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting 2fiat Commander!'))

  const appSecret = await storeJson.read((s) => s.appSecret).const(effects)
  const signupEnabled = await storeJson
    .read((s) => s.signupEnabled)
    .const(effects)
  if (!appSecret) throw new Error('store.json has no appSecret')

  return sdk.Daemons.of(effects).addDaemon('main', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      dataMounts,
      'main',
    ),
    exec: {
      command: ['node', 'apps/server/src/main.ts'],
      cwd: appDir,
      env: {
        HOST: '0.0.0.0',
        PORT: String(uiPort),
        DATABASE_PATH: databasePath,
        WEB_DIST: 'apps/web/dist',
        SYNC_INTERVAL_MINUTES: '360',
        SIGNUP_ENABLED: String(signupEnabled ?? false),
        APP_SECRET: appSecret,
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://localhost:${uiPort}/api/health`,
          {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          },
        ),
    },
    requires: [],
  })
})
