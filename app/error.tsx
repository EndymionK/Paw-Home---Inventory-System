"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Home, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-paw-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/paw-home-logo.png"
              alt="Logotipo de Paw & Home"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-xl font-semibold text-paw-brown mb-2">Error del Sistema</h1>
          <p className="text-gray-600 mb-4">Ha ocurrido un error inesperado en el sistema de inventario.</p>

          <Alert variant="destructive" className="mb-6 text-left">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error.message || "Error interno del servidor"}</AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} variant="outline" className="flex-1 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-paw-primary hover:bg-paw-blue text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
