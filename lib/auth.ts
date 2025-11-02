// Simple authentication context for the Paw & Home system
import { config } from './config'

export interface User {
  id: string
  username: string
  role: "admin"
}

const SESSION_DURATION = config.sessionDuration

export interface SessionData {
  user: User
  token: string
  timestamp: number
  expiresAt: number
}

// Helper function to decode JWT token (simple base64 decode)
function decodeJWT(token: string): { username: string; rol: string } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return {
      username: payload.sub || payload.username,
      rol: payload.rol || payload.role || 'ADMIN'
    }
  } catch {
    return null
  }
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const response = await fetch(`${config.apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      // Mensaje genérico de error (HU-6.1 seguridad)
      return null
    }

    const data = await response.json()
    const token = data.token

    if (!token) {
      return null
    }

    // Decodificar el token para obtener información del usuario
    const decoded = decodeJWT(token)
    if (!decoded) {
      return null
    }

    const user: User = {
      id: decoded.username, // Usamos username como ID
      username: decoded.username,
      role: "admin" // Por ahora todos son admin según el sistema actual
    }

    setAuthUser(user, token)
    return user
  } catch (error) {
    console.error('Error al autenticar:', error)
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

export function setAuthUser(user: User, token?: string): void {
  const sessionData: SessionData = {
    user,
    token: token || '',
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

export function getAuthToken(): string | null {
  const sessionData = getSessionData()
  return sessionData?.token || null
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

  // Extend session (keep the same token)
  setAuthUser(sessionData.user, sessionData.token)
  return true
}
