"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. Please try again or request a new verification email.")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message || "Your email has been verified successfully!")
        } else {
          setStatus("error")
          setMessage(data.message || "Failed to verify your email. Please try again.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    verifyEmail()
  }, [token])

  const handleGoToLogin = () => {
    router.push("/auth/login")
  }

  const handleResendVerification = async () => {
    // Implementation for resending verification email would go here
    setMessage("Verification email has been sent. Please check your inbox.")
  }

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
          <h1 className="text-2xl font-semibold text-center mb-6">Email Verification</h1>

          {status === "loading" && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#185047] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 mb-6">{message}</p>
              <button
                onClick={handleGoToLogin}
                className="bg-[#185047] text-white px-6 py-2 rounded-md hover:bg-[#185047]/90 transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 mb-6">{message}</p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleResendVerification}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Resend Verification Email
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="bg-[#185047] text-white px-6 py-2 rounded-md hover:bg-[#185047]/90 transition-colors"
                >
                  Return Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
