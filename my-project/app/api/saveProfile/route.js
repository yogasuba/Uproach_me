import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
  try {
    const { userId, profilePic, about } = await request.json();

    // Update the user profile with the new data
    const updatedUser = await prisma.user.update({
      where: { id: userId }, // Ensure userId is a string if your id field is a string
      data: {
        profilePic,
        about,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.error('Failed to update profile');
  }
}
