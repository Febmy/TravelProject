import nodemailer from 'nodemailer';

// Konfigurasi Transport NodeMailer
// Gunakan ENV variables untuk production
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true, // true untuk 465, false untuk port lain
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendBookingEmail = async (
  to: string,
  bookingCode: string,
  title: string,
  guestName: string,
  totalPrice: number,
  status: 'PENDING' | 'CONFIRMED'
) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER atau EMAIL_PASS tidak ditemukan di .env, simulasi pengiriman email.');
    return;
  }

  const subject = status === 'PENDING' 
    ? `Menunggu Pembayaran - Pesanan ${bookingCode} (${title})`
    : `E-Ticket / Bukti Reservasi - Pesanan ${bookingCode} LUNAS`;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const htmlContent = status === 'PENDING' ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">Pesanan Berhasil Dibuat!</h2>
      <p>Halo <strong>${guestName}</strong>,</p>
      <p>Terima kasih telah memesan <strong>${title}</strong> di platform kami. Berikut adalah rincian pesanan Anda:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Kode Booking</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bookingCode}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total Harga</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatRupiah(totalPrice)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Status</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #d97706; font-weight: bold;">MENUNGGU PEMBAYARAN</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">Silakan segera lakukan pembayaran dan unggah bukti transfer melalui halaman cek pesanan / dashboard Anda agar kami dapat memproses keberangkatan/reservasi Anda.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">Email ini dikirim otomatis. Jangan balas ke email ini.</p>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #16a34a; text-align: center;">E-Ticket / Pesanan LUNAS</h2>
      <p>Halo <strong>${guestName}</strong>,</p>
      <p>Pembayaran untuk pesanan <strong>${title}</strong> Anda telah berhasil kami konfirmasi. Berikut adalah E-Ticket Anda:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: #f9fafb; padding: 15px; border-radius: 8px;">
        <tr>
          <td style="padding: 8px;"><strong>Kode Booking</strong></td>
          <td style="padding: 8px; font-weight: bold;">${bookingCode}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Total Dibayar</strong></td>
          <td style="padding: 8px;">${formatRupiah(totalPrice)}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Status</strong></td>
          <td style="padding: 8px; color: #16a34a; font-weight: bold;">CONFIRMED (LUNAS)</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">Harap simpan email ini atau kode booking Anda dengan baik. Tunjukkan kode ini kepada petugas hotel / tour guide pada saat keberangkatan/check-in.</p>
      <p>Selamat menikmati perjalanan / liburan Anda bersama kami!</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">Email ini dikirim otomatis. Jangan balas ke email ini.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Travel Project" <no-reply@yourtravel.com>',
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email terkirim: ${info.messageId}`);
  } catch (error) {
    console.error('Gagal mengirim email:', error);
  }
};

export const sendVerificationEmail = async (to: string, token: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER atau EMAIL_PASS tidak ditemukan di .env, simulasi email verifikasi.');
    console.log(`Simulasi link verifikasi: http://localhost:3000/api/auth/verify-email?token=${token}`);
    return;
  }

  // Use the actual domain in production (e.g. process.env.NEXT_PUBLIC_APP_URL)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationLink = `${appUrl}/api/auth/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">Verifikasi Alamat Email Anda</h2>
      <p>Halo,</p>
      <p>Terima kasih telah mendaftar di platform kami. Untuk mulai menggunakan akun Anda, silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #007026; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verifikasi Email Sekarang</a>
      </div>
      <p>Atau salin tautan berikut ke browser Anda:</p>
      <p style="word-break: break-all; color: #555;">${verificationLink}</p>
      <p>Link verifikasi ini akan kadaluarsa dalam waktu 24 jam.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">Jika Anda tidak merasa mendaftar di platform kami, silakan abaikan email ini.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Travel Project" <no-reply@yourtravel.com>',
      to,
      subject: 'Verifikasi Akun Travel Anda',
      html: htmlContent,
    });
    console.log(`Email verifikasi terkirim: ${info.messageId}`);
  } catch (error) {
    console.error('Gagal mengirim email verifikasi:', error);
  }
};

