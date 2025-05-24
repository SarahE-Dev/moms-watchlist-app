import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${process.env.TMDB_API_KEY}`)

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `TMDB API Error: ${response.status} ${response.statusText}`,
      })
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      message: "TMDB API is working correctly!",
      data: data,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Connection error: ${error}`,
    })
  }
}
