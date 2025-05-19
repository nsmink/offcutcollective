import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { randomBytes } from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Check if user exists and needs verification
    const users = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (users.length === 0) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({
        message: "If your email is registered and not verified, you will receive a verification email",
      })
    }

    const user = users[0]

    // If the email is already verified, don't send another verification email
    if (user.emailVerified) {
      return NextResponse.json({
        message: "This email is already verified. Please log in.",
      })
    }

    // Delete any existing verification tokens for this user
    await sql`
      DELETE FROM "VerificationToken" 
      WHERE identifier = ${email} AND token NOT LIKE 'reset-%'
    `

    // Generate new verification token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    // Store verification token
    await sql`
      INSERT INTO "VerificationToken" (identifier, token, expires)
      VALUES (${email}, ${token}, ${expires})
    `

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json({
      message: "If your email is registered and not verified, you will receive a verification email",
    })
  } catch (error) {
    console.error("Error resending verification email:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
