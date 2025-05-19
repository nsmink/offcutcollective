"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [infoMessage, setInfoMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for verification success message
    const verified = searchParams?.get("verified")
    if (verified === "true") {
      setInfoMessage("Your email has been verified successfully. You can now log in.")
    }

    // Check for password reset success message
    const resetSuccess = searchParams?.get("passwordReset")
    if (resetSuccess === "true") {
      setInfoMessage("Your password has been reset successfully. You can now log in with your new password.")
    }
  }, [searchParams])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setInfoMessage("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "Email not verified") {
          setError("Your email is not verified. Please check your inbox for the verification email.")
        } else {
          setError("Invalid email or password")
        }
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-semibold text-center mb-6">Log in to Offcut Co.</h1>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}
          {infoMessage && <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">{infoMessage}</div>}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#185047]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#185047]"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#185047] focus:ring-[#185047] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-[#185047] hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#185047] text-white py-2 px-4 rounded-md hover:bg-[#185047]/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#185047] hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-4 text-center text-sm">
            <button onClick={() => router.push("/auth/resend-verification")} className="text-[#185047] hover:underline">
              Resend verification email
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
