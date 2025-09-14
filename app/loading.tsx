import Image from "next/image"

export default function Loading() {
  return (
    <div className="min-h-screen bg-paw-background flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/paw-home-logo.png"
            alt="Logotipo de Paw & Home"
            width={60}
            height={60}
            className="object-contain animate-pulse"
          />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paw-primary mx-auto mb-4"></div>
        <p className="text-paw-brown font-medium">Cargando sistema...</p>
        <p className="text-sm text-gray-600 mt-1">Por favor espere</p>
      </div>
    </div>
  )
}
