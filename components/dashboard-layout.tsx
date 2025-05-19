"use client"

import type React from "react"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { HomeIcon, PackageIcon, UserIcon, LogOutIcon } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

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
    <div className="min-h-screen bg-[#fefaed] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Offcut Co. Logo" width={48} height={48} className="object-contain" priority />
            <span className="ml-2 text-xl font-semibold">Offcut Co.</span>
          </Link>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                <HomeIcon className="mr-3 h-5 w-5 text-[#185047]" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/inventory"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <PackageIcon className="mr-3 h-5 w-5 text-[#185047]" />
                Inventory
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <UserIcon className="mr-3 h-5 w-5 text-[#185047]" />
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {session?.user?.image ? (
                <Image
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <UserIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-sm text-gray-600">{session?.user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOutIcon className="mr-3 h-5 w-5 text-red-500" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
