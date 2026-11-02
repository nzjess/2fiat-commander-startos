import { sdk } from '../sdk'
import { createOrResetUser } from './createOrResetUser'
import { toggleSignup } from './toggleSignup'

export const actions = sdk.Actions.of()
  .addAction(createOrResetUser)
  .addAction(toggleSignup)
