import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { dbClient } from '../src/lib/server/db/dbClient'
import { log } from 'console'

log('🤞 Performing migration')

migrate(dbClient, { migrationsFolder: 'drizzle' })

log('🎉 Migration done')
