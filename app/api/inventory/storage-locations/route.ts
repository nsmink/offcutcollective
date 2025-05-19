import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// GET all storage locations for the logged-in user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all storage locations for the user
    const storageLocations = await sql`
      SELECT * FROM "StorageLocation"
      WHERE "userId" = ${userId}
      ORDER BY name ASC
    `

    return NextResponse.json(storageLocations)
  } catch (error) {
    console.error("Error fetching storage locations:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// POST a new storage location
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    // Check if storage location with this name already exists for the user
    const existingLocations = await sql`
      SELECT * FROM "StorageLocation"
      WHERE "userId" = ${userId} AND name = ${name}
    `

    if (existingLocations.length > 0) {
      return NextResponse.json({ message: "Storage location with this name already exists" }, { status: 409 })
    }

    // Generate a unique ID
    const locationId = uuidv4()

    // Insert the storage location
    await sql`
      INSERT INTO "StorageLocation" (id, "userId", name, "createdAt", "updatedAt")
      VALUES (${locationId}, ${userId}, ${name}, NOW(), NOW())
    `

    // Get the created storage location
    const locations = await sql`
      SELECT * FROM "StorageLocation"
      WHERE id = ${locationId}
    `

    return NextResponse.json(locations[0], { status: 201 })
  } catch (error) {
    console.error("Error creating storage location:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
