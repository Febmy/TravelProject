import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan.' }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Token tidak valid atau sudah digunakan.' }, { status: 400 });
    }

    if (new Date() > new Date(verificationToken.expires)) {
      return NextResponse.json({ error: 'Token sudah kedaluwarsa.' }, { status: 400 });
    }

    // Aktifkan User
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { isVerified: true },
    });

    // Hapus Token agar tidak bisa dipakai lagi
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Redirect ke halaman login dengan pesan sukses
    // Ganti URL jika domain berbeda di production
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/login?verified=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
