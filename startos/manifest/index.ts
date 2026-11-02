import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: '2fiat-commander',
  title: '2fiat Commander',
  license: 'MIT',
  packageRepo: 'https://github.com/nzjess/2fiat-commander-startos',
  upstreamRepo: 'https://github.com/nzjess/2fiat-commander',
  marketingUrl: 'https://github.com/nzjess/2fiat-commander',
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'startos'],
  images: {
    main: {
      source: { dockerBuild: {} },
      arch: ['x86_64'],
    },
  },
})
