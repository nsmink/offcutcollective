import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 })
    }

    // Find the verification token
    const tokens = await sql`
      SELECT * FROM "VerificationToken" 
      WHERE token = ${token} AND expires > NOW()
    `

    if (tokens.length === 0) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    const verificationToken = tokens[0]

    // Update user's emailVerified field
    await sql`
      UPDATE "User" 
      SET "emailVerified" = NOW() 
      WHERE email = ${verificationToken.identifier}
    `

    // Delete the used token
    await sql`
      DELETE FROM "VerificationToken" 
      WHERE token = ${token}
    `

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
