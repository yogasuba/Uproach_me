// app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const { token, newPassword } = await request.json();

  try {
    // Log received token and new password
    console.log('Received token:', token);
    console.log('New password:', newPassword);

    // Find the password reset request by token
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    });

    // Log the result of the database query
    console.log('Found password reset:', passwordReset);

    if (!passwordReset || new Date() > passwordReset.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword }
    });

    // Delete the password reset request
    await prisma.passwordReset.delete({
      where: { token }
    });

    return NextResponse.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
