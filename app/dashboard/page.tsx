"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { PackageIcon, UserIcon, SearchIcon } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [materialCount, setMaterialCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchMaterialCount()
    }
  }, [status])

  const fetchMaterialCount = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/inventory/materials")

      if (!response.ok) {
        throw new Error("Failed to fetch materials")
      }

      const data = await response.json()
      setMaterialCount(data.length)
    } catch (error) {
      console.error("Error fetching material count:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#fefaed] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#185047] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#185047]">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null // Will redirect in useEffect
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Welcome, {session?.user?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">My Inventory</h2>
              <PackageIcon className="h-8 w-8 text-[#185047]" />
            </div>
            <p className="text-3xl font-bold mb-2">{isLoading ? "..." : materialCount}</p>
            <p className="text-gray-600 mb-4">materials in your inventory</p>
            <Link href="/dashboard/inventory">
              <Button className="w-full bg-[#185047] hover:bg-[#185047]/90">Manage Inventory</Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Community Materials</h2>
              <SearchIcon className="h-8 w-8 text-[#185047]" />
            </div>
            <p className="text-3xl font-bold mb-2">{isLoading ? "..." : "0"}</p>
            <p className="text-gray-600 mb-4">materials available to browse</p>
            <Button className="w-full bg-[#185047] hover:bg-[#185047]/90" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">My Profile</h2>
              <UserIcon className="h-8 w-8 text-[#185047]" />
            </div>
            <p className="text-gray-600 mb-4">Update your information and preferences</p>
            <Link href="/dashboard/profile">
              <Button className="w-full bg-[#185047] hover:bg-[#185047]/90">Edit Profile</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-[#185047] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                1
              </div>
              <div>
                <h3 className="font-medium">Add your materials</h3>
                <p className="text-gray-600">
                  Start by adding materials to your inventory. You can add dimensions, storage location, and images.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-[#185047] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                2
              </div>
              <div>
                <h3 className="font-medium">Organize your storage</h3>
                <p className="text-gray-600">
                  Create storage locations to keep track of where your materials are stored.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-[#185047] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                3
              </div>
              <div>
                <h3 className="font-medium">Share with the community</h3>
                <p className="text-gray-600">
                  Mark materials as "Open to Community" to share them with other Offcut Co. members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
