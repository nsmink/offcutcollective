/**
 * Determines the base URL for the application
 * Works across all environments (local, preview, production)
 */
export function getBaseUrl(): string {
  // First priority: explicitly set NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // Second priority: Vercel deployment URL (automatically set in production)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Third priority: fallback for local development
  return "http://localhost:3000"
}

/**
 * Gets the absolute URL for a path
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}
