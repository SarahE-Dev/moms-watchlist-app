// lib/types.ts

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
