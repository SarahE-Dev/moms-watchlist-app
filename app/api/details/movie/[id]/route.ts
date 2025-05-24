import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await params.id
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Movie details error:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
