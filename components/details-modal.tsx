"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Clock, Users } from "lucide-react"
import type { Suggestion } from "@/lib/suggestionService"
import { getMovieDetails, getTVShowDetails, getImageUrl, type MovieDetails, type TVShowDetails } from "@/lib/tmdb"

interface DetailsModalProps {
  suggestion: Suggestion | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DetailsModal({ suggestion, open, onOpenChange }: DetailsModalProps) {
  const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (suggestion && open) {
      setLoading(true)
      const fetchDetails = async () => {
        try {
          if (suggestion.type === "movie") {
            const movieDetails = await getMovieDetails(suggestion.tmdbId)
            setDetails(movieDetails)
          } else {
            const tvDetails = await getTVShowDetails(suggestion.tmdbId)
            setDetails(tvDetails)
          }
        } catch (error) {
          console.error("Error fetching details:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchDetails()
    }
  }, [suggestion, open])

  if (!suggestion) return null

  const isMovie = suggestion.type === "movie"
  const movieDetails = details as MovieDetails
  const tvDetails = details as TVShowDetails

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-500/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">{suggestion.title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Image
                  src={
                    suggestion.posterPath ? getImageUrl(suggestion.posterPath) : "/placeholder.svg?height=600&width=400"
                  }
                  alt={suggestion.title}
                  width={400}
                  height={600}
                  className="w-full rounded-xl"
                />
              </div>

              <div className="md:w-2/3 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    {isMovie ? "Movie" : "TV Show"}
                  </Badge>
                  {details?.genres?.map((genre) => (
                    <Badge key={genre.id} variant="outline" className="border-gray-600 text-gray-300">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{suggestion.rating.toFixed(1)}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(suggestion.releaseDate).getFullYear()}</span>
                  </div>
                  {isMovie && movieDetails?.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{movieDetails.runtime} min</span>
                    </div>
                  )}
                  {!isMovie && tvDetails && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {tvDetails.number_of_seasons} seasons, {tvDetails.number_of_episodes} episodes
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-100 leading-relaxed">{suggestion.overview}</p>

                {!isMovie && tvDetails?.seasons && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 gradient-text">
                      <Users className="w-4 h-4" />
                      Seasons
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {tvDetails.seasons
                        .filter((season) => season.season_number > 0)
                        .map((season) => (
                          <div key={season.id} className="bg-gray-700/50 p-2 rounded-xl text-sm">
                            <div className="font-medium text-gray-100">{season.name}</div>
                            <div className="text-gray-400">{season.episode_count} episodes</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {details?.credits?.cast && details.credits.cast.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2 gradient-text">
                  <Users className="w-4 h-4" />
                  Cast
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {details.credits.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="text-center">
                      <Image
                        src={
                          actor.profile_path ? getImageUrl(actor.profile_path) : "/placeholder.svg?height=150&width=100"
                        }
                        alt={actor.name}
                        width={100}
                        height={150}
                        className="w-full h-24 object-cover rounded-xl mb-2"
                      />
                      <div className="text-sm font-medium text-gray-100">{actor.name}</div>
                      <div className="text-xs text-gray-400">{actor.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
