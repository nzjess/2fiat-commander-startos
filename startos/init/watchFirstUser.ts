import { createOrResetUser } from '../actions/createOrResetUser'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const watchFirstUser = sdk.setupOnInit(async (effects) => {
  const firstUserCreated = await storeJson
    .read((s) => s.firstUserCreated)
    .const(effects)

  if (!firstUserCreated) {
    await sdk.action.createOwnTask(effects, createOrResetUser, 'critical', {
      reason: i18n('Create the first user, so you can log in'),
    })
  }
})
