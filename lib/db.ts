// db.ts
import Database from 'better-sqlite3'

const db = new Database('suggestions.db')

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS suggestions (
    id TEXT PRIMARY KEY,
    tmdbId INTEGER,
    type TEXT,
    title TEXT,
    overview TEXT,
    posterPath TEXT,
    releaseDate TEXT,
    rating REAL,
    addedAt TEXT,
    watched INTEGER
  )
`)

export default db
