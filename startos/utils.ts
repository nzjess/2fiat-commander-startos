import { sdk } from './sdk'

export const uiPort = 3000
// Requested, not guaranteed. Kept across updates; applies when the binding is first created.
export const uiSslPort = 3443
export const databasePath = '/data/commander.db'
export const appDir = '/app'

export const dataMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/data',
  readonly: false,
})
