import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
  try {
    const { userId, availability } = await request.json();

    const availabilityPromises = Object.entries(availability).map(([day, { isAvailable, timeSlots }]) =>
      prisma.availability.create({
        data: {
          userId,
          day,
          isAvailable,
          timeSlots,
        },
      })
    );

    await Promise.all(availabilityPromises);

    return NextResponse.json({ message: 'Availability saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving availability:', error);
    return NextResponse.json({ message: 'Failed to save availability' }, { status: 500 });
  }
}
