import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'spliit',
  title: 'Spliit',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/spliit-startos',
  upstreamRepo: 'https://github.com/spliit-app/spliit',
  supportSite: 'https://github.com/spliit-app/spliit/issues',
  marketingSite: 'https://spliit.app/',
  donationUrl: null,
  docsUrl: 'https://github.com/spliit-app/spliit#readme',
  description: {
    short: 'Free and open source expense sharing app',
    long: 'Spliit is a free and open source alternative to Splitwise. Share expenses with your friends and family. Create groups for trips, events, gifts, and more. Track who owes what and settle up easily.',
  },
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerBuild: {
          workdir: './spliit',
        },
      },
    },
    postgres: {
      source: {
        dockerTag: 'postgres:16-alpine',
      },
    },
  },
  alerts: {
    install:
      'Spliit uses a PostgreSQL database to store your data. All data is stored locally on your StartOS server.',
    update: null,
    uninstall:
      'Uninstalling Spliit will delete all expense data. Make sure to export any data you want to keep.',
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
