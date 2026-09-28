import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '27cq7h1v',
    dataset: 'production'
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
  deployment: {
    appId: 'z9y98ehzsdmd8d7s9reuj9ep',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
