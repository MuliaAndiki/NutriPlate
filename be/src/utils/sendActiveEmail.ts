import nodemailer from 'nodemailer';
import { env } from '@/config/env.config';

export const sendActivationEmail = async (to: string, activationLink: string) => {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"NutriPlate" <${env.SMTP_USER}>`,
    to,
    subject: 'Aktivasi Akun Posyandu Anda',
    text: `Aktivasi akun Anda dengan membuka link berikut: ${activationLink}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;">
  <h2>Aktivasi Akun Posyandu</h2>
  <p>Akun posyandu Anda telah berhasil dibuat.</p>
  <p>Silakan klik tombol di bawah untuk mengaktifkan akun dan membuat password:</p>

  <button href="${activationLink}"
     style="background:#16a34a;color:#ffffff;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
            font-weight:bold;
            margin-top:8px;">
    Aktivasi Akun
  </button>

  <p style="margin-top:16px;">
    Jika tombol tidak berfungsi, buka link berikut:<br/>
    <a href="${activationLink}">${activationLink}</a>
  </p>

  <p>Link ini akan kedaluwarsa dalam <b>15 menit</b>.</p>
  <hr />
  <small>© NutriPlate</small>
</div>
    `,
  });
};
