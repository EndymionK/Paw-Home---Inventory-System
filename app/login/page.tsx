"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authenticateUser, isAuthenticated, setAuthUser } from "@/lib/auth"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await authenticateUser(username, password)
      if (user) {
        setAuthUser(user)
        router.push("/dashboard")
      } else {
        setError("Usuario o contraseña incorrectos")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSupport = () => {
    alert("Para soporte técnico, contacte al administrador del sistema.")
  }

  return (
    <div className="min-h-screen bg-paw-background flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/paw-home-logo.png"
                alt="Paw & Home Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-paw-brown">Inicio de Sesión Seguro</h1>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-paw-brown font-medium">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  required
                  className="border-paw-primary focus:ring-paw-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-paw-brown font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                    className="border-paw-primary focus:ring-paw-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-paw-primary hover:bg-paw-blue text-white font-medium"
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSupport}
                  className="flex-1 border-paw-primary text-paw-primary hover:bg-paw-primary hover:text-white bg-transparent"
                >
                  Soporte
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-paw-primary text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          <Image
            src="/images/paw-home-logo.png"
            alt="Paw & Home Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-sm font-medium">Sistema de gestión de inventario Paw & Home</span>
        </div>
      </footer>
    </div>
  )
}
