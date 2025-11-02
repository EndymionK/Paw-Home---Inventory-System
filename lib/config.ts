// Configuration file for API URLs and environment variables
// Next.js automatically injects NEXT_PUBLIC_* variables at build time

export const config = {
  // API URL - fallback to production Render URL
  // Will be replaced with NEXT_PUBLIC_API_URL from .env.local at build time
  apiUrl: 'https://petstore-backend-jrt5.onrender.com',
  
  // Session duration in milliseconds (15 minutes as per HU-6.3)
  sessionDuration: 15 * 60 * 1000,
}


