"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { isAuthenticated } from "@/lib/auth"
import { getProductById, type Product } from "@/lib/products"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Package, DollarSign, Building2, FileText } from "lucide-react"

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const productId = params.id as string
    const foundProduct = getProductById(productId)

    if (foundProduct) {
      setProduct(foundProduct)
    }

    setIsLoading(false)
  }, [router, params.id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paw-primary mx-auto"></div>
            <p className="mt-4 text-paw-brown">Cargando producto...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const getStockStatus = () => {
    if (product.stock === 0) return { label: "No disponible", variant: "destructive" as const, color: "text-red-600" }
    if (product.stock <= product.minStock)
      return { label: "Stock bajo", variant: "secondary" as const, color: "text-yellow-600" }
    return { label: "Disponible", variant: "default" as const, color: "text-green-600" }
  }

  const stockStatus = getStockStatus()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-paw-brown">Detalle de Producto</h1>
              <p className="text-gray-600">Información completa del producto</p>
            </div>
          </div>

          <Button
            onClick={() => router.push(`/product/${product.id}/edit`)}
            className="bg-paw-primary hover:bg-paw-blue text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <Badge variant={stockStatus.variant} className="mb-2">
                  {stockStatus.label}
                </Badge>
                <p className={`text-sm font-medium ${stockStatus.color}`}>{product.stock} unidades disponibles</p>
                {product.stock <= product.minStock && (
                  <p className="text-xs text-gray-500 mt-1">Stock mínimo: {product.minStock} unidades</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-paw-brown">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Nombre del Producto
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Proveedor
                    </label>
                    <p className="text-lg text-gray-900">{product.supplier}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Precio de Venta
                  </label>
                  <p className="text-2xl font-bold text-paw-green-1">${product.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stock Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-paw-brown">Información de Existencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-paw-primary/5 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Stock Actual</p>
                    <p className="text-2xl font-bold text-paw-primary">{product.stock}</p>
                    <p className="text-xs text-gray-500">unidades</p>
                  </div>

                  <div className="text-center p-4 bg-paw-coral/5 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Stock Mínimo</p>
                    <p className="text-2xl font-bold text-paw-coral">{product.minStock}</p>
                    <p className="text-xs text-gray-500">unidades</p>
                  </div>

                  <div className="text-center p-4 bg-paw-green-1/5 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Valor Total</p>
                    <p className="text-2xl font-bold text-paw-green-1">${(product.price * product.stock).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">en inventario</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Characteristics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-paw-brown flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Características
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.characteristics}</p>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-paw-brown">Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Fecha de Creación</p>
                    <p className="text-gray-600">
                      {product.createdAt.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Última Actualización</p>
                    <p className="text-gray-600">
                      {product.updatedAt.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
