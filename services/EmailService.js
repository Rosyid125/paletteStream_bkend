const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.GMAIL_USER, // alamat gmail
    pass: process.env.GMAIL_PASS, // app password gmail
  },
});

class EmailService {
  static async sendOtpEmail(email, otp) {
    const mailOptions = {
      from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
      to: email,
      subject: "Kode OTP Login PaletteStream",
      text: `Kode OTP Anda: ${otp}\nBerlaku 30 detik. Jangan bagikan kode ini ke siapapun.`,
      html: `
        <div style="background:#22c55e;padding:32px 0;text-align:center;font-family:sans-serif;min-height:100vh;">
          <div style="background:#fff;border-radius:12px;max-width:420px;margin:0 auto;padding:32px 24px 24px 24px;box-shadow:0 2px 16px rgba(34,197,94,0.08);">
            <h2 style="color:#22c55e;margin-bottom:8px;">PaletteStream</h2>
            <p style="color:#222;font-size:16px;margin-bottom:24px;">Kode OTP Login Anda:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#22c55e;background:#f3fef6;padding:16px 0;border-radius:8px;margin-bottom:24px;">${otp}</div>
            <p style="color:#222;font-size:14px;margin-bottom:8px;">Kode berlaku <b>30 detik</b>.</p>
            <p style="color:#888;font-size:13px;">Jangan bagikan kode ini ke siapapun.<br>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
          </div>
          <div style="margin-top:32px;color:#fff;font-size:13px;">&copy; ${new Date().getFullYear()} PaletteStream</div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  }

  static async sendOtpEmailRegister(email, otp) {
    const mailOptions = {
      from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
      to: email,
      subject: "Kode OTP Registrasi PaletteStream",
      text: `Kode OTP Anda: ${otp}\nGunakan kode ini untuk menyelesaikan proses registrasi akun. Kode hanya dapat digunakan satu kali. Jangan bagikan kode ini ke siapapun.`,
      html: `
        <div style="background:#22c55e;padding:32px 0;text-align:center;font-family:sans-serif;min-height:100vh;">
          <div style="background:#fff;border-radius:12px;max-width:420px;margin:0 auto;padding:32px 24px 24px 24px;box-shadow:0 2px 16px rgba(34,197,94,0.08);">
            <h2 style="color:#22c55e;margin-bottom:8px;">PaletteStream</h2>
            <p style="color:#222;font-size:16px;margin-bottom:24px;">Kode OTP Registrasi Anda:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#22c55e;background:#f3fef6;padding:16px 0;border-radius:8px;margin-bottom:24px;">${otp}</div>
            <p style="color:#222;font-size:14px;margin-bottom:8px;">Kode ini hanya dapat digunakan satu kali untuk proses registrasi akun.</p>
            <p style="color:#888;font-size:13px;">Jangan bagikan kode ini ke siapapun.<br>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
          </div>
          <div style="margin-top:32px;color:#fff;font-size:13px;">&copy; ${new Date().getFullYear()} PaletteStream</div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;

/*
ENV yang diperlukan:
GMAIL_USER=alamat@gmail.com
GMAIL_PASS=app_password_gmail
GMAIL_FROM=PaletteStream <alamat@gmail.com> (opsional)
*/
