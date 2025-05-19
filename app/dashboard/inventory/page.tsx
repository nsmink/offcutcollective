"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import InventoryList from "@/components/inventory/inventory-list"
import AddMaterialForm from "@/components/inventory/add-material-form"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function InventoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [materials, setMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddingMaterial, setIsAddingMaterial] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchMaterials()
    }
  }, [status])

  const fetchMaterials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/inventory/materials")

      if (!response.ok) {
        throw new Error("Failed to fetch materials")
      }

      const data = await response.json()
      setMaterials(data)
    } catch (error) {
      console.error("Error fetching materials:", error)
      setError("Failed to load inventory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMaterial = async (materialData) => {
    try {
      const response = await fetch("/api/inventory/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(materialData),
      })

      if (!response.ok) {
        throw new Error("Failed to add material")
      }

      await fetchMaterials()
      setIsAddingMaterial(false)
    } catch (error) {
      console.error("Error adding material:", error)
      setError("Failed to add material. Please try again.")
    }
  }

  const handleDeleteMaterial = async (id) => {
    try {
      const response = await fetch(`/api/inventory/materials/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete material")
      }

      await fetchMaterials()
    } catch (error) {
      console.error("Error deleting material:", error)
      setError("Failed to delete material. Please try again.")
    }
  }

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#185047] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (status === "unauthenticated") {
    return null // Will redirect in useEffect
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Inventory</h1>
          <Button onClick={() => setIsAddingMaterial(true)} className="bg-[#185047] hover:bg-[#185047]/90">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

        {isAddingMaterial ? (
          <AddMaterialForm onSubmit={handleAddMaterial} onCancel={() => setIsAddingMaterial(false)} />
        ) : (
          <InventoryList
            materials={materials}
            isLoading={isLoading}
            onDelete={handleDeleteMaterial}
            onRefresh={fetchMaterials}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
