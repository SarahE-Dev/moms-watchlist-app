"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Film, Tv } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { searchMovies, searchTVShows, type Movie, type TVShow, getImageUrl } from "@/lib/tmdb"
import { addSuggestion } from "@/lib/storage"
import { PasswordDialog } from "./password-dialog"
import Image from "next/image"
import { testTMDBConnection } from "@/lib/api-test" // Import testTMDBConnection

interface SearchAddProps {
  onSuggestionAdded: () => void
}

export function SearchAdd({ onSuggestionAdded }: SearchAddProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie")
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(Movie | TVShow) | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [apiStatus, setApiStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [isTestingAPI, setIsTestingAPI] = useState(false)

  useEffect(() => {
    // Test API connection on component mount
    testAPI()
  }, [])

  const testAPI = async () => {
    setIsTestingAPI(true)
    const result = await testTMDBConnection()
    setApiStatus(result)
    setIsTestingAPI(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      let results: (Movie | TVShow)[] = []

      if (searchType === "movie") {
        results = await searchMovies(searchQuery)
      } else {
        results = await searchTVShows(searchQuery)
      }

      console.log(`Found ${results.length} ${searchType} results for "${searchQuery}"`)
      setSearchResults(results)
      setShowResults(true)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
      setSearchQuery("")
    }
  }

  const handleAddSuggestion = (item: Movie | TVShow) => {
    setSelectedItem(item)
    setShowPasswordDialog(true)
  }

  const confirmAddSuggestion = () => {
    if (!selectedItem) return

    const isMovie = searchType === "movie"
    const movieItem = selectedItem as Movie
    const tvItem = selectedItem as TVShow

    addSuggestion({
      tmdbId: selectedItem.id,
      type: searchType,
      title: isMovie ? movieItem.title : tvItem.name,
      overview: selectedItem.overview,
      posterPath: selectedItem.poster_path,
      releaseDate: isMovie ? movieItem.release_date : tvItem.first_air_date,
      rating: selectedItem.vote_average,
    })

    setSelectedItem(null)
    setShowResults(false)
    setSearchQuery("")
    setSearchResults([])
    onSuggestionAdded()
  }

  return (
    <>
      <div className="mb-8 space-y-4">
        {/* Search Form */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={searchType} onValueChange={(value: "movie" | "tv") => setSearchType(value)}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="movie" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    Movies
                  </div>
                </SelectItem>
                <SelectItem value="tv" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4" />
                    TV Shows
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder={`Search for ${searchType === "movie" ? "movies" : "TV shows"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />

            <Button
              onClick={handleSearch}
              disabled={isSearching || !apiStatus?.success}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-sm text-gray-400">
            {searchType === "movie" ? "🎬" : "📺"} Searching for {searchType === "movie" ? "movies" : "TV shows"}
          </p>
        </div>
      </div>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="bg-gray-800 border-purple-500/30 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="gradient-text">
              {searchType === "movie" ? "🎬 Movie" : "📺 TV Show"} Search Results ({searchResults.length})
            </DialogTitle>
          </DialogHeader>

          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No {searchType === "movie" ? "movies" : "TV shows"} found for "{searchQuery}"
              </p>
              <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item) => {
                const isMovie = searchType === "movie"
                const movieItem = item as Movie
                const tvItem = item as TVShow

                return (
                  <Card key={item.id} className="bg-gray-700/50 border-gray-600">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <Image
                          src={
                            item.poster_path ? getImageUrl(item.poster_path) : "/placeholder.svg?height=120&width=80"
                          }
                          alt={isMovie ? movieItem.title : tvItem.name}
                          width={80}
                          height={120}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm line-clamp-2 gradient-text">
                              {isMovie ? movieItem.title : tvItem.name}
                            </h4>
                            <Badge variant="outline" className="ml-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {isMovie ? "Movie" : "TV"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-200 line-clamp-3 mb-2">{item.overview}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {new Date(isMovie ? movieItem.release_date : tvItem.first_air_date).getFullYear() ||
                                "N/A"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-yellow-400">⭐ {item.vote_average.toFixed(1)}</span>
                              <Button
                                onClick={() => handleAddSuggestion(item)}
                                size="sm"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSuccess={confirmAddSuggestion}
        title="Add Suggestion"
        description="Enter password to add this suggestion"
      />
    </>
  )
}
