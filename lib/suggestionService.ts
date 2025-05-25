import { Suggestion } from '../types/suggestion'

// suggestionService.ts
import db from './db'

export function getSuggestions(): Suggestion[] {
  const stmt = db.prepare('SELECT * FROM suggestions')
  const rows = stmt.all()
  return rows.map((row: any) => ({
    ...row,
    watched: Boolean(row.watched),
  }))
}

export function saveSuggestions(suggestions: Suggestion[]): void {
  const deleteStmt = db.prepare('DELETE FROM suggestions')
  deleteStmt.run()

  const insertStmt = db.prepare(`
    INSERT INTO suggestions (
      id, tmdbId, type, title, overview, posterPath,
      releaseDate, rating, addedAt, watched
    ) VALUES (
      @id, @tmdbId, @type, @title, @overview, @posterPath,
      @releaseDate, @rating, @addedAt, @watched
    )
  `)

  const insertMany = db.transaction((suggestions: Suggestion[]) => {
    for (const suggestion of suggestions) {
      insertStmt.run({
        ...suggestion,
        watched: suggestion.watched ? 1 : 0,
      })
    }
  })

  insertMany(suggestions)
}

export function addSuggestion(suggestion: Omit<Suggestion, 'id' | 'addedAt' | 'watched'>): void {
  const newSuggestion: Suggestion = {
    ...suggestion,
    id: Date.now().toString(),
    addedAt: new Date().toISOString(),
    watched: false,
  }

  const stmt = db.prepare(`
    INSERT INTO suggestions (
      id, tmdbId, type, title, overview, posterPath,
      releaseDate, rating, addedAt, watched
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    newSuggestion.id,
    newSuggestion.tmdbId,
    newSuggestion.type,
    newSuggestion.title,
    newSuggestion.overview,
    newSuggestion.posterPath,
    newSuggestion.releaseDate,
    newSuggestion.rating,
    newSuggestion.addedAt,
    0
  )
}

export function markAsWatched(id: string): void {
  const stmt = db.prepare('UPDATE suggestions SET watched = 1 WHERE id = ?')
  stmt.run(id)
}

export function removeSuggestion(id: string): void {
  const stmt = db.prepare('DELETE FROM suggestions WHERE id = ?')
  stmt.run(id)
}
