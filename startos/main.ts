import { sdk } from './sdk'
import { uiPort, postgresPort, postgresUser, postgresDb } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Spliit!')

  // Read stored configuration
  const store = await storeJson.read((s) => s).const(effects)

  // Create PostgreSQL subcontainer
  const postgresSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'postgres',
      mountpoint: '/var/lib/postgresql/data',
      readonly: false,
    }),
    'postgres-sub',
  )

  // Create Spliit app subcontainer
  const appSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of(),
    'spliit-sub',
  )

  // Database connection string - use localhost since daemons share the network
  const databaseUrl = `postgresql://${postgresUser}:${store?.postgresPassword ?? ''}@127.0.0.1:${postgresPort}/${postgresDb}`

  return sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_PASSWORD: store?.postgresPassword ?? '',
          POSTGRES_DB: postgresDb,
          PGDATA: '/var/lib/postgresql/data/pgdata',
        },
      },
      ready: {
        display: 'Database',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, postgresPort, {
            successMessage: 'PostgreSQL is ready',
            errorMessage: 'PostgreSQL is not ready',
          }),
      },
      requires: [],
    })
    .addDaemon('spliit', {
      subcontainer: appSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          DATABASE_URL: databaseUrl,
          NEXT_TELEMETRY_DISABLED: '1',
        },
      },
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: 'Spliit is ready',
            errorMessage: 'Spliit is not ready',
          }),
      },
      requires: ['postgres'],
    })
})
