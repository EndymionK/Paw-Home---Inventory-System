// Simple authentication context for the Paw & Home system
export interface User {
  id: string
  username: string
  role: "admin"
}

// Mock user data - in a real app this would come from a database
const ADMIN_USERS = [
  { id: "1", username: "admin", password: "admin123", role: "admin" as const },
  { id: "2", username: "pawadmin", password: "paw2024", role: "admin" as const },
]

const SESSION_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export interface SessionData {
  user: User
  timestamp: number
  expiresAt: number
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://petstore-backend-jrt5.onrender.com"
    
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    
    // Guardar el token JWT en localStorage
    if (data.token) {
      localStorage.setItem("paw-auth-token", data.token)
    }

    // Crear objeto usuario compatible
    const user: User = {
      id: data.username, // Usar username como ID temporal
      username: data.username || username,
      role: "admin", // Por ahora todos son admin
    }

    setAuthUser(user)
    return user
  } catch (error) {
    console.error("Error en autenticación:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const sessionData = getSessionData()
  if (!sessionData) return false

  // Check if session has expired
  if (Date.now() > sessionData.expiresAt) {
    logout() // Clear expired session
    return false
  }

  return true
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const sessionData = getSessionData()
  if (!sessionData) return null

  // Check if session has expired
  if (Date.now() > sessionData.expiresAt) {
    logout() // Clear expired session
    return null
  }

  return sessionData.user
}

export function setAuthUser(user: User): void {
  const sessionData: SessionData = {
    user,
    timestamp: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  }
  localStorage.setItem("paw-auth-session", JSON.stringify(sessionData))
}

export function logout(): void {
  localStorage.removeItem("paw-auth-session")
  localStorage.removeItem("paw-auth-token") // Limpiar token JWT
  // Also remove old auth key for backward compatibility
  localStorage.removeItem("paw-auth-user")
}

function getSessionData(): SessionData | null {
  try {
    const sessionStr = localStorage.getItem("paw-auth-session")
    if (!sessionStr) {
      // Check for old auth format and migrate
      const oldUserData = localStorage.getItem("paw-auth-user")
      if (oldUserData) {
        const user = JSON.parse(oldUserData)
        setAuthUser(user) // Migrate to new format
        localStorage.removeItem("paw-auth-user")
        return getSessionData() // Get the newly created session
      }
      return null
    }
    return JSON.parse(sessionStr)
  } catch {
    return null
  }
}

export function refreshSession(): boolean {
  const sessionData = getSessionData()
  if (!sessionData) return false

  // Only refresh if session is still valid
  if (Date.now() > sessionData.expiresAt) {
    logout()
    return false
  }

  // Extend session
  setAuthUser(sessionData.user)
  return true
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("paw-auth-token")
}
