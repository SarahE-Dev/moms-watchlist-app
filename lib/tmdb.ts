const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids: number[]
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  genre_ids: number[]
}

export interface MovieDetails extends Movie {
  runtime: number
  genres: { id: number; name: string }[]
  credits: {
    cast: Array<{
      id: number
      name: string
      character: string
      profile_path: string
    }>
  }
}

export interface TVShowDetails extends TVShow {
  number_of_seasons: number
  number_of_episodes: number
  genres: { id: number; name: string }[]
  credits: {
    cast: Array<{
      id: number
      name: string
      character: string
      profile_path: string
    }>
  }
  seasons: Array<{
    id: number
    name: string
    episode_count: number
    season_number: number
  }>
}

export async function testTMDBConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/test-tmdb")
    const data = await response.json()
    return data
  } catch (error) {
    return { success: false, message: `Connection failed: ${error}` }
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await fetch(`/api/search/movies?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Search failed")
    return await response.json()
  } catch (error) {
    console.error("Movie search error:", error)
    return []
  }
}

export async function searchTVShows(query: string): Promise<TVShow[]> {
  try {
    const response = await fetch(`/api/search/tv?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Search failed")
    return await response.json()
  } catch (error) {
    console.error("TV search error:", error)
    return []
  }
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const response = await fetch(`/api/details/movie/${id}`)
  if (!response.ok) throw new Error("Failed to fetch movie details")
  return response.json()
}

export async function getTVShowDetails(id: number): Promise<TVShowDetails> {
  const response = await fetch(`/api/details/tv/${id}`)
  if (!response.ok) throw new Error("Failed to fetch TV details")
  return response.json()
}

export function getImageUrl(path: string): string {
  return `${TMDB_IMAGE_BASE_URL}${path}`
}
