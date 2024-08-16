import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // Validate input
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email is already in use' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return new Response(JSON.stringify({ message: 'User created successfully', user }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
  }
}