"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, refreshSession } from "@/lib/auth"

export function useAuthGuard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push("/login")
        return false
      }

      // Refresh session to extend expiry
      if (!refreshSession()) {
        router.push("/login")
        return false
      }

      return true
    }

    const authorized = checkAuth()
    setIsAuthorized(authorized)
    setIsLoading(false)

    // Set up periodic session check every 5 minutes
    const interval = setInterval(
      () => {
        if (!checkAuth()) {
          setIsAuthorized(false)
        }
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [router])

  return { isLoading, isAuthorized }
}
