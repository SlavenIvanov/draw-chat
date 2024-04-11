import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

export const pixels = sqliteTable(
  'pixels',
  {
    x: integer('x').notNull(),
    y: integer('y').notNull(),
    color: text('color').notNull(),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.x, table.y] }) }
  }
)

export const users = sqliteTable('users', {
  name: text('name').primaryKey().notNull(),
  lastHeartBeat: text('lastHeartBeat')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})
