import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.results || [])
  } catch (error) {
    console.error("TV search error:", error)
    return NextResponse.json({ error: "Failed to search TV shows" }, { status: 500 })
  }
}
