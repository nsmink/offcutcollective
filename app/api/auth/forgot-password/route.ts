import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { randomBytes } from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const users = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (users.length === 0) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({ message: "If your email is registered, you will receive a password reset link" })
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Delete any existing reset tokens for this user
    await sql`
      DELETE FROM "VerificationToken" 
      WHERE identifier = ${email} AND token LIKE 'reset-%'
    `

    // Store reset token (prefix with 'reset-' to distinguish from email verification tokens)
    await sql`
      INSERT INTO "VerificationToken" (identifier, token, expires)
      VALUES (${email}, ${"reset-" + token}, ${expires})
    `

    // Send password reset email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({
      message: "If your email is registered, you will receive a password reset link",
    })
  } catch (error) {
    console.error("Error requesting password reset:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
