import prisma from '../../../../lib/prisma'; // Import the existing prisma instance

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
    }

    // Fetch existing welcome data for the user
    const welcomeData = await prisma.welcomeData.findFirst({
      where: { userId: String(userId) },
    });

    return new Response(JSON.stringify(welcomeData || {}), { status: 200 });
  } catch (error) {
    console.error('Error fetching welcome data:', error);
    return new Response(JSON.stringify({ error: 'Error fetching welcome data' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, username, fullName, timezone } = await req.json();

    if (!userId || !username || !fullName || !timezone) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    // Ensure userId is treated as a string
    const userIdString = String(userId);

    // Fetch existing welcome data for the user
    const existingWelcomeData = await prisma.welcomeData.findFirst({
      where: { userId: userIdString },
    });

    if (existingWelcomeData) {
      // If welcome data exists, update it
      await prisma.welcomeData.update({
        where: { id: existingWelcomeData.id },
        data: { username, fullName, timezone },
      });
    } else {
      // If no welcome data exists, create a new record
      await prisma.welcomeData.create({
        data: { userId: userIdString, username, fullName, timezone },
      });
    }

    // Update the username in the User model
    await prisma.user.update({
      where: { id: userIdString },
      data: { username },
    });

    return new Response(JSON.stringify({ message: 'Welcome data updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating welcome data:', error);

    if (error.code === 'P2025') { // Prisma's record not found error code
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ error: 'Error updating welcome data' }), { status: 500 });
  }
}
