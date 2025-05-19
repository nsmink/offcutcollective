import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Find the reset token
    const tokens = await sql`
      SELECT * FROM "VerificationToken" 
      WHERE token = ${"reset-" + token} AND expires > NOW()
    `

    if (tokens.length === 0) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    const resetToken = tokens[0]

    // Hash the new password
    const hashedPassword = await hash(password, 12)

    // Update the user's password
    await sql`
      UPDATE "User" 
      SET password = ${hashedPassword}, "updatedAt" = NOW() 
      WHERE email = ${resetToken.identifier}
    `

    // Delete the used token
    await sql`
      DELETE FROM "VerificationToken" 
      WHERE token = ${"reset-" + token}
    `

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
