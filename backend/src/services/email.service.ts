import transporter from '../config/nodemailer'
import { generateEmailTemplate } from '../utils/emailTemplates'

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
  const htmlContent = generateEmailTemplate({
    title: 'Verify Your Email',
    message: 'Please click the button below to verify your email address.',
    buttonText: 'Verify Email',
    buttonLink: verifyLink,
  })

  await transporter.sendMail({
    from: `"PT Navindo Maritim Indonesia" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification',
    html: htmlContent,
  })
}
