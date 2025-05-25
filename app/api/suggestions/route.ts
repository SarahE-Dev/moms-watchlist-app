import { NextRequest, NextResponse } from 'next/server'
import { getSuggestions, addSuggestion } from '@/lib/suggestionService'

export function GET() {
  const suggestions = getSuggestions()
  return NextResponse.json(suggestions)
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  try {
    addSuggestion(data) // id, addedAt, watched will be set automatically
    return NextResponse.json({ message: 'Suggestion added' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add suggestion' }, { status: 500 })
  }
}
