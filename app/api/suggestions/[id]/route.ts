import { NextRequest, NextResponse } from 'next/server'
import { markAsWatched, removeSuggestion, getSuggestions } from '@/lib/suggestionService'

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { params } = context
    const id = params.id

    await removeSuggestion(id)
    const updatedSuggestions = await getSuggestions()

    return NextResponse.json(updatedSuggestions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete suggestion' }, { status: 500 })
  }
}

export async function PATCH(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    await markAsWatched(params.id)
    const updatedSuggestions = await getSuggestions()

    return NextResponse.json(updatedSuggestions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 })
  }
}
