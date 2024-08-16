// lib/auth.js
import { prisma } from './prisma';
import crypto from 'crypto';

export async function generatePasswordResetToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

  await prisma.passwordReset.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}
