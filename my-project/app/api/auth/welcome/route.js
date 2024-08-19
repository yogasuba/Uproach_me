import prisma from '../../../../lib/prisma'; // Import the existing prisma instance

export async function POST(req) {
  const { userId, username, fullName, timezone } = await req.json();

  if (!userId || !username || !fullName || !timezone) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
  }

  try {
    // Convert userId to string
    const userIdString = userId.toString();

    // Find existing welcome data
    const existingWelcomeData = await prisma.welcomeData.findFirst({
      where: { userId: userIdString }
    });

    if (existingWelcomeData) {
      // If welcome data exists, update it
      await prisma.welcomeData.update({
        where: { id: existingWelcomeData.id },
        data: { username, fullName, timezone }
      });
    } else {
      // If welcome data does not exist, create it
      await prisma.welcomeData.create({
        data: { userId: userIdString, username, fullName, timezone }
      });
    }

    // Update the user record
    await prisma.user.update({
      where: { id: userIdString },
      data: { username }
    });

    return new Response(JSON.stringify({ message: 'Welcome data updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating welcome data:', error);
    return new Response(JSON.stringify({ error: 'Error updating welcome data' }), { status: 500 });
  }
}