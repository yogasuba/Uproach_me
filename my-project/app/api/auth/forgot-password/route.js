// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../../../lib/sendEmail';

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, you will receive a password reset email.' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Save the token and related data to the PasswordReset model
    await prisma.passwordReset.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 3600000), // Token expires in 1 hour
        userId: user.id,
      },
    });

    // Send the reset link via email
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error('Error processing password reset request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
