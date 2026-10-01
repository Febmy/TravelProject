import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import crypto from 'crypto';


export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nama, Email, dan Password harus diisi.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber: phone,
        passwordHash: hashedPassword,
        // isVerified defaults to false
      },
    });

    // Buat Verification Token (Kedaluwarsa dalam 24 jam)
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        email: user.email,
        token,
        expires,
      }
    });

    // Kirim Email Verifikasi
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { sendVerificationEmail } = require('@/lib/email');
    sendVerificationEmail(user.email, token).catch((err: any) => 
      console.error('Failed to send verification email:', err)
    );

    return NextResponse.json(
      { message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.', user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
