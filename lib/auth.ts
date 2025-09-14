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

const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export interface SessionData {
  user: User
  timestamp: number
  expiresAt: number
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = ADMIN_USERS.find((u) => u.username === username && u.password === password)
  if (user) {
    setAuthUser(user)
    return user
  }
  return null
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
