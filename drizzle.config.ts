import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  driver: 'libsql',
  out: 'drizzle',
  dbCredentials: {
    url: 'file:./db/sqlite.db',
  },
  verbose: true,
  strict: true,
})
