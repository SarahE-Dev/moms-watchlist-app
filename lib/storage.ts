export interface Suggestion {
  id: string
  tmdbId: number
  type: "movie" | "tv"
  title: string
  overview: string
  posterPath: string
  releaseDate: string
  rating: number
  addedAt: string
  watched: boolean
}

export function getSuggestions(): Suggestion[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("movie-suggestions")
  return stored ? JSON.parse(stored) : []
}

export function saveSuggestions(suggestions: Suggestion[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("movie-suggestions", JSON.stringify(suggestions))
}

export function addSuggestion(suggestion: Omit<Suggestion, "id" | "addedAt" | "watched">): void {
  const suggestions = getSuggestions()
  const newSuggestion: Suggestion = {
    ...suggestion,
    id: Date.now().toString(),
    addedAt: new Date().toISOString(),
    watched: false,
  }
  suggestions.push(newSuggestion)
  saveSuggestions(suggestions)
}

export function markAsWatched(id: string): void {
  const suggestions = getSuggestions()
  const updated = suggestions.map((s) => (s.id === id ? { ...s, watched: true } : s))
  saveSuggestions(updated)
}

export function removeSuggestion(id: string): void {
  const suggestions = getSuggestions()
  const filtered = suggestions.filter((s) => s.id !== id)
  saveSuggestions(filtered)
}
