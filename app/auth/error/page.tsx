"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams?.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "Configuration":
          setError("There is a problem with the server configuration.")
          break
        case "AccessDenied":
          setError("You do not have permission to sign in.")
          break
        case "Verification":
          setError("The verification link is invalid or has expired.")
          break
        default:
          setError("An unexpected error occurred.")
          break
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#fefaed] flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="w-32 h-32 relative">
          <Image src="/logo.svg" alt="Offcut Co. Logo" width={120} height={120} className="object-contain" priority />
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-6">Authentication Error</h1>

          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            <p>{error || "An error occurred during authentication."}</p>
          </div>

          <p className="text-center mb-6">Please try again or contact support if the problem persists.</p>

          <div className="flex justify-center">
            <Link
              href="/auth/login"
              className="bg-[#185047] text-white px-6 py-2 rounded-md hover:bg-[#185047]/90 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
