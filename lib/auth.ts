/**
 * Helper function to get the base URL for authentication
 * Works in both development and production environments
 */
export function getBaseAuthUrl() {
  // For local development
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback
  return "http://localhost:3000"
}
