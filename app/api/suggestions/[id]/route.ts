import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await prisma.suggestion.delete({
      where: { id },
    });
    const updatedSuggestions = await prisma.suggestion.findMany();
    revalidatePath('/'); // Revalidate the homepage
    return NextResponse.json(
      updatedSuggestions.map((s) => ({
        ...s,
        tmdbId: Number(s.tmdbId),
        rating: Number(s.rating),
        watched: Boolean(s.watched),
      }))
    );
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    return NextResponse.json({ error: 'Failed to delete suggestion' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await prisma.suggestion.update({
      where: { id },
      data: { watched: true },
    });
    const updatedSuggestions = await prisma.suggestion.findMany();
    revalidatePath('/'); // Revalidate the homepage
    return NextResponse.json(
      updatedSuggestions.map((s) => ({
        ...s,
        tmdbId: Number(s.tmdbId),
        rating: Number(s.rating),
        watched: Boolean(s.watched),
      }))
    );
  } catch (error) {
    console.error('Error updating suggestion:', error);
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
  }
}