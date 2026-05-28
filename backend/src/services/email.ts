import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password من Google
    },
  })
}

export async function sendOtpEmail(toEmail: string, otp: string, userName?: string): Promise<void> {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"منتوج فلاح بلادي 🌾" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `رمز التحقق: ${otp}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f0fdf4; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2D6A4F, #1B4332); padding: 28px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🌾 منتوج فلاح بلادي</h1>
          <p style="color: #86efac; margin: 6px 0 0; font-size: 14px;">استعادة كلمة المرور</p>
        </div>
        <div style="padding: 28px 24px; background: white;">
          <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">
            ${userName ? `مرحباً <strong>${userName}</strong>،` : 'مرحباً،'}
          </p>
          <p style="color: #374151; font-size: 14px; margin: 0 0 24px;">
            طلبت إعادة تعيين كلمة المرور لحسابك. استخدم الرمز التالي:
          </p>
          <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 42px; font-weight: 900; color: #2D6A4F; letter-spacing: 12px; margin: 0;">${otp}</p>
            <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">صالح لمدة 15 دقيقة فقط</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            إذا لم تطلب هذا، تجاهل هذا الإيميل. حسابك آمن.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">منتوج فلاح بلادي — التسويق يبدأ من يوم البذور</p>
        </div>
      </div>
    `,
  })
}
