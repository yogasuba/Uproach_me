import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new Response(JSON.stringify({ error: 'No account found with this email' }), { status: 404 });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    // Password is correct, return success and userId
    return new Response(JSON.stringify({ message: 'Sign In successful', userId: user.id }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
  }
}
