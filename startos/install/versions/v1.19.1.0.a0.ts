import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_19_1_0_a0 = VersionInfo.of({
  version: '1.19.1:0-alpha.0',
  releaseNotes: 'Initial release for StartOS',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
