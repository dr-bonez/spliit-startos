import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, string } = matches

const shape = object({
  postgresPassword: string.optional().onMismatch(undefined),
})

export const storeJson = FileHelper.json(
  '/media/startos/volumes/main/store.json',
  shape,
)
