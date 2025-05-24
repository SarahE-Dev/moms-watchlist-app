"use client"

import { useState, useEffect } from "react"
import { Film, Tv, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSuggestions, markAsWatched, removeSuggestion, type Suggestion } from "@/lib/storage"
import { SuggestionCard } from "@/components/suggestion-card"
import { SearchAdd } from "@/components/search-add"
import { DetailsModal } from "@/components/details-modal"

export default function HomePage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    setSuggestions(getSuggestions())
  }, [])

  const handleMarkWatched = (id: string) => {
    markAsWatched(id)
    setSuggestions(getSuggestions())
  }

  const handleRemove = (id: string) => {
    removeSuggestion(id)
    setSuggestions(getSuggestions())
  }

  const handleViewDetails = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion)
    setShowDetails(true)
  }

  const handleSuggestionAdded = () => {
    setSuggestions(getSuggestions())
    setShowSearch(false)
  }

  const unwatchedSuggestions = suggestions.filter((s) => !s.watched)
  const watchedSuggestions = suggestions.filter((s) => s.watched)
  const movieSuggestions = unwatchedSuggestions.filter((s) => s.type === "movie")
  const tvSuggestions = unwatchedSuggestions.filter((s) => s.type === "tv")

  return (
    <div className="min-h-screen p-4 md:p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">Mom's Watchlist</h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-100 mb-6">{"Your personal collection of must-watch movies and shows! ✨"}</p>
          <Button
            onClick={() => setShowSearch(!showSearch)}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 text-white font-semibold px-8 py-3 text-lg"
          >
            {showSearch ? "Hide Search" : "Add New Suggestions"}
          </Button>
        </div>

        {/* Search Section */}
        {showSearch && (
          <div className="mb-8 animate-slide-up">
            <SearchAdd onSuggestionAdded={handleSuggestionAdded} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-semibold">{movieSuggestions.length} Movies</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-500/20 to-yellow-500/20 p-4 rounded-xl border border-pink-500/30">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-pink-400" />
              <span className="text-lg font-semibold">{tvSuggestions.length} TV Shows</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 p-4 rounded-xl border border-yellow-500/30">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold">{watchedSuggestions.length} Watched</span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full !rounded-xl">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              All ({unwatchedSuggestions.length})
            </TabsTrigger>
            <TabsTrigger
              value="movies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Movies ({movieSuggestions.length})
            </TabsTrigger>
            <TabsTrigger
              value="tv"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              TV Shows ({tvSuggestions.length})
            </TabsTrigger>
            <TabsTrigger
              value="watched"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Watched ({watchedSuggestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {unwatchedSuggestions.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-xl gradient-text">No suggestions yet!</p>
                <p className="text-gray-300">Add some movies and shows to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {unwatchedSuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onMarkWatched={handleMarkWatched}
                    onRemove={handleRemove}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="movies" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movieSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onMarkWatched={handleMarkWatched}
                  onRemove={handleRemove}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tv" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tvSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onMarkWatched={handleMarkWatched}
                  onRemove={handleRemove}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="watched" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchedSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onMarkWatched={handleMarkWatched}
                  onRemove={handleRemove}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DetailsModal suggestion={selectedSuggestion} open={showDetails} onOpenChange={setShowDetails} />
    </div>
  )
}
