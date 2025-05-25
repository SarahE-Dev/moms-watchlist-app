import { PrismaClient } from '@prisma/client'
import { Suggestion } from '../types/suggestion'

const prisma = new PrismaClient()

export async function getSuggestions(): Promise<Suggestion[]> {
  const suggestions = await prisma.suggestion.findMany()
  return suggestions.map((s: Suggestion) => ({
    ...s,
    watched: Boolean(s.watched),
  }))
}

export async function saveSuggestions(suggestions: Suggestion[]): Promise<void> {
  // Clear existing suggestions
  await prisma.suggestion.deleteMany()

  // Bulk insert
  await prisma.suggestion.createMany({
    data: suggestions.map((s) => ({
      ...s,
      watched: s.watched ?? false,
    })),
  })
}

export async function addSuggestion(
  suggestion: Omit<Suggestion, 'id' | 'addedAt' | 'watched'>
): Promise<void> {
  await prisma.suggestion.create({
    data: {
      ...suggestion,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
      watched: false,
    },
  })
}

export async function markAsWatched(id: string): Promise<void> {
  await prisma.suggestion.update({
    where: { id },
    data: { watched: true },
  })
}

export async function removeSuggestion(id: string): Promise<void> {
  await prisma.suggestion.delete({
    where: { id },
  })
}
