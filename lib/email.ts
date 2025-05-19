import nodemailer from "nodemailer"
import { getBaseUrl } from "./url-helpers"

export type EmailPayload = {
  to: string
  subject: string
  html: string
}

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export const sendEmail = async (payload: EmailPayload) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...payload,
    })
    return { success: true, result }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

// Update the sendVerificationEmail function to use a more resilient approach
export const sendVerificationEmail = async (email: string, token: string) => {
  // Get base URL with fallback for when VERCEL_URL is not available
  let baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  // In production Vercel environment, use VERCEL_URL if available
  if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`
  }

  const verificationUrl = `${baseUrl}/auth/verify?token=${token}`

  return sendEmail({
    to: email,
    subject: "Verify your Offcut Co. account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #185047; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Offcut Co.</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <h2>Verify your email address</h2>
          <p>Thank you for signing up with Offcut Co. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #185047; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create an account with Offcut Co., you can safely ignore this email.</p>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Offcut Co. - A platform for circular craftspeople</p>
        </div>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${getBaseUrl()}/auth/reset-password?token=${token}`

  return sendEmail({
    to: email,
    subject: "Reset your Offcut Co. password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #185047; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Offcut Co.</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <h2>Reset your password</h2>
          <p>You've requested to reset your password for your Offcut Co. account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #185047; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This password reset link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Offcut Co. - A platform for circular craftspeople</p>
        </div>
      </div>
    `,
  })
}
