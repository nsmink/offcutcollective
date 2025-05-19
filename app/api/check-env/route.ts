import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    nextAuthUrl: process.env.NEXTAUTH_URL ? "Set ✅" : "Not set ❌",
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? "Set ✅" : "Not set ❌",
    databaseUrl: process.env.DATABASE_URL ? "Set ✅" : "Not set ❌",
    // Don't return the actual values for security reasons
  })
}
