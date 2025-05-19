import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { sendVerificationEmail } from "@/lib/email"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate a unique ID
    const userId = uuidv4()

    // Create user (with emailVerified set to null)
    await sql`
      INSERT INTO "User" (id, name, email, password, "createdAt", "updatedAt")
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword}, NOW(), NOW())
    `

    // Generate verification token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    // Store verification token
    await sql`
      INSERT INTO "VerificationToken" (identifier, token, expires)
      VALUES (${email}, ${token}, ${expires})
    `

    // Send verification email
    await sendVerificationEmail(email, token)

    // Get the created user
    const users = await sql`
      SELECT id, name, email, "createdAt" FROM "User" WHERE id = ${userId}
    `

    const user = users[0]

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
