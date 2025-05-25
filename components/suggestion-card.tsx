"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Star, Calendar } from "lucide-react"
import { Suggestion } from "@/types/suggestion"
import { getImageUrl } from "@/lib/tmdb"
import { PasswordDialog } from "./password-dialog"

interface SuggestionCardProps {
  suggestion: Suggestion
  onMarkWatched: (id: string) => void
  onRemove: (id: string) => void
  onViewDetails: (suggestion: Suggestion) => void
}

export function SuggestionCard({ suggestion, onMarkWatched, onRemove, onViewDetails }: SuggestionCardProps) {
  const [showWatchedDialog, setShowWatchedDialog] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700 card-hover animate-fade-in overflow-hidden">
        <div className="relative">
          <Image
            src={suggestion.posterPath ? getImageUrl(suggestion.posterPath) : "/placeholder.svg?height=400&width=300"}
            alt={suggestion.title}
            width={300}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {suggestion.type === "movie" ? "Movie" : "TV Show"}
            </Badge>
          </div>
          {suggestion.watched && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-500 text-white">
                <Eye className="w-3 h-3 mr-1" />
                Watched
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 gradient-text">{suggestion.title}</h3>
          <p className="text-gray-200 text-sm mb-3 line-clamp-3">{suggestion.overview}</p>

          <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{suggestion.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{suggestion.releaseDate ? new Date(suggestion.releaseDate).getFullYear() : ""}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onViewDetails(suggestion)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              View Details
            </Button>
            {!suggestion.watched && (
              <Button
                onClick={() => setShowWatchedDialog(true)}
                variant="outline"
                size="icon"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => setShowRemoveDialog(true)}
              variant="outline"
              size="icon"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <PasswordDialog
        open={showWatchedDialog}
        onOpenChange={setShowWatchedDialog}
        onSuccess={() => onMarkWatched(suggestion.id)}
        title="Mark as Watched"
        description="Enter password to mark this as watched"
      />

      <PasswordDialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        onSuccess={() => onRemove(suggestion.id)}
        title="Remove Suggestion"
        description="Enter password to remove this suggestion"
      />
    </>
  )
}
