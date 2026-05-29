import twilio from 'twilio'

export async function sendOtpSms(phone: string, otp: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio environmental variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not configured.')
  }

  const client = twilio(accountSid, authToken)
  await client.messages.create({
    body: `رمز التحقق الخاص بك في منتوج فلاح بلادي: ${otp}\nصالح لمدة 15 دقيقة.`,
    from: fromNumber,
    to: phone,
  })
}
