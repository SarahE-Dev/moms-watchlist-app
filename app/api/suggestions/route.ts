import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const suggestions = await prisma.suggestion.findMany();
    return NextResponse.json(
      suggestions.map((s) => ({
        ...s,
        tmdbId: Number(s.tmdbId), // Ensure tmdbId is number
        rating: Number(s.rating), // Ensure rating is number
        watched: Boolean(s.watched), // Ensure watched is boolean
      })),
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tmdbId, type, title, overview, posterPath, releaseDate, rating } = await req.json();
    
    // Validate required fields
    if (!tmdbId || !type || !title || !releaseDate || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate type
    if (!['movie', 'tv'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type, must be "movie" or "tv"' }, { status: 400 });
    }

    await prisma.suggestion.create({
      data: {
        tmdbId,
        type,
        title,
        overview,
        posterPath,
        releaseDate,
        rating,
        addedAt: new Date().toISOString(),
        watched: false,
      },
    });
    revalidatePath('/'); // Revalidate the homepage
    return NextResponse.json({ message: 'Suggestion added' }, { status: 201 });
  } catch (error) {
    console.error('Error adding suggestion:', error);
    return NextResponse.json({ error: 'Failed to add suggestion' }, { status: 500 });
  }
}