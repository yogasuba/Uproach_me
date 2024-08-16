import prisma from '../../../../lib/prisma'; // Import the existing prisma instance

export async function POST(req) {
  const { userId, username, fullName, timezone } = await req.json();

  if (!userId || !username || !fullName || !timezone) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
  }

  try {
    // Convert userId to integer
    const userIdInt = parseInt(userId, 10);

    if (isNaN(userIdInt)) {
      return new Response(JSON.stringify({ error: 'Invalid userId' }), { status: 400 });
    }

    // Update user and related data
    await prisma.user.update({
      where: { id: userIdInt },
      data: {
        username,
        welcomeData: {
          upsert: {
            where: { userId: userIdInt },
            update: { username, fullName, timezone },
            create: { username, fullName, timezone }
          }
        }
      }
    });

    return new Response(JSON.stringify({ message: 'Welcome data updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating welcome data:', error);
    return new Response(JSON.stringify({ error: 'Error updating welcome data' }), { status: 500 });
  }
}
