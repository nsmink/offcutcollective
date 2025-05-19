import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/db"

// GET a specific material
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const materialId = params.id

    // Get the material
    const materials = await sql`
      SELECT m.*, sl.name as "storageLocationName"
      FROM "Material" m
      LEFT JOIN "StorageLocation" sl ON m."storageLocationId" = sl.id
      WHERE m.id = ${materialId} AND m."userId" = ${userId}
    `

    if (materials.length === 0) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 })
    }

    return NextResponse.json(materials[0])
  } catch (error) {
    console.error("Error fetching material:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// PUT (update) a material
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const materialId = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.label || !data.state) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if material exists and belongs to user
    const existingMaterials = await sql`
      SELECT * FROM "Material" 
      WHERE id = ${materialId} AND "userId" = ${userId}
    `

    if (existingMaterials.length === 0) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 })
    }

    // Update the material
    await sql`
      UPDATE "Material" 
      SET 
        label = ${data.label},
        width = ${data.width || null},
        length = ${data.length || null},
        thickness = ${data.thickness || null},
        "storageLocationId" = ${data.storageLocationId || null},
        state = ${data.state},
        "inventorySince" = ${data.inventorySince ? new Date(data.inventorySince) : existingMaterials[0].inventorySince},
        "openToCommunity" = ${data.openToCommunity !== undefined ? data.openToCommunity : existingMaterials[0].openToCommunity},
        "imageUrl" = ${data.imageUrl || existingMaterials[0].imageUrl},
        "updatedAt" = NOW()
      WHERE id = ${materialId} AND "userId" = ${userId}
    `

    // Get the updated material
    const materials = await sql`
      SELECT m.*, sl.name as "storageLocationName"
      FROM "Material" m
      LEFT JOIN "StorageLocation" sl ON m."storageLocationId" = sl.id
      WHERE m.id = ${materialId}
    `

    return NextResponse.json(materials[0])
  } catch (error) {
    console.error("Error updating material:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// DELETE a material
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const materialId = params.id

    // Check if material exists and belongs to user
    const existingMaterials = await sql`
      SELECT * FROM "Material" 
      WHERE id = ${materialId} AND "userId" = ${userId}
    `

    if (existingMaterials.length === 0) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 })
    }

    // Delete the material
    await sql`
      DELETE FROM "Material" 
      WHERE id = ${materialId} AND "userId" = ${userId}
    `

    return NextResponse.json({ message: "Material deleted successfully" })
  } catch (error) {
    console.error("Error deleting material:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
