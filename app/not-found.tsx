"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-paw-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/paw-home-logo.png"
              alt="Logotipo de Paw & Home"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <h1 className="text-6xl font-bold text-paw-primary mb-4">404</h1>
          <h2 className="text-xl font-semibold text-paw-brown mb-2">Página No Encontrada</h2>
          <p className="text-gray-600 mb-6">La página que buscas no existe o ha sido movida.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => router.back()} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
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
