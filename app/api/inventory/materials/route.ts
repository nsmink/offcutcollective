import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// GET all materials for the logged-in user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all materials for the user
    const materials = await sql`
      SELECT m.*, sl.name as "storageLocationName"
      FROM "Material" m
      LEFT JOIN "StorageLocation" sl ON m."storageLocationId" = sl.id
      WHERE m."userId" = ${userId}
      ORDER BY m."createdAt" DESC
    `

    return NextResponse.json(materials)
  } catch (error) {
    console.error("Error fetching materials:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// POST a new material
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await request.json()

    // Validate required fields
    if (!data.label || !data.state) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate a unique ID
    const materialId = uuidv4()

    // Set inventory date if not provided
    const inventorySince = data.inventorySince ? new Date(data.inventorySince) : new Date()

    // Insert the material
    await sql`
      INSERT INTO "Material" (
        id, 
        "userId", 
        label, 
        width, 
        length, 
        thickness, 
        "storageLocationId", 
        state, 
        "inventorySince", 
        "openToCommunity", 
        "imageUrl", 
        "createdAt", 
        "updatedAt"
      )
      VALUES (
        ${materialId}, 
        ${userId}, 
        ${data.label}, 
        ${data.width || null}, 
        ${data.length || null}, 
        ${data.thickness || null}, 
        ${data.storageLocationId || null}, 
        ${data.state}, 
        ${inventorySince}, 
        ${data.openToCommunity || false}, 
        ${data.imageUrl || null}, 
        NOW(), 
        NOW()
      )
    `

    // Get the created material
    const materials = await sql`
      SELECT m.*, sl.name as "storageLocationName"
      FROM "Material" m
      LEFT JOIN "StorageLocation" sl ON m."storageLocationId" = sl.id
      WHERE m.id = ${materialId}
    `

    return NextResponse.json(materials[0], { status: 201 })
  } catch (error) {
    console.error("Error creating material:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
