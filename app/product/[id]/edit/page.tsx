"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { isAuthenticated } from "@/lib/auth"
import { getProductById, type Product, MOCK_PRODUCTS } from "@/lib/products"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Upload, AlertCircle, CheckCircle } from "lucide-react"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    supplier: "",
    price: "",
    stock: "",
    minStock: "",
    image: "",
    characteristics: "",
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const productId = params.id as string
    const foundProduct = getProductById(productId)

    if (foundProduct) {
      setProduct(foundProduct)
      setFormData({
        name: foundProduct.name,
        supplier: foundProduct.supplier,
        price: foundProduct.price.toString(),
        stock: foundProduct.stock.toString(),
        minStock: foundProduct.minStock.toString(),
        image: foundProduct.image,
        characteristics: foundProduct.characteristics,
      })
    }

    setIsLoading(false)
  }, [router, params.id])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setMessage(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      // Validate form
      if (!formData.name.trim() || !formData.supplier.trim() || !formData.characteristics.trim()) {
        throw new Error("Todos los campos obligatorios deben ser completados")
      }

      const price = Number.parseFloat(formData.price)
      const stock = Number.parseInt(formData.stock)
      const minStock = Number.parseInt(formData.minStock)

      if (isNaN(price) || price <= 0) {
        throw new Error("El precio debe ser un número válido mayor a 0")
      }

      if (isNaN(stock) || stock < 0) {
        throw new Error("Las existencias deben ser un número válido mayor o igual a 0")
      }

      if (isNaN(minStock) || minStock < 0) {
        throw new Error("El stock mínimo debe ser un número válido mayor o igual a 0")
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the product in mock data
      const productIndex = MOCK_PRODUCTS.findIndex((p) => p.id === product?.id)
      if (productIndex !== -1) {
        MOCK_PRODUCTS[productIndex] = {
          ...MOCK_PRODUCTS[productIndex],
          name: formData.name.trim(),
          supplier: formData.supplier.trim(),
          price: price,
          stock: stock,
          minStock: minStock,
          image: formData.image || MOCK_PRODUCTS[productIndex].image,
          characteristics: formData.characteristics.trim(),
          updatedAt: new Date(),
        }
      }

      setMessage({ type: "success", text: "Producto actualizado exitosamente" })

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/product/${product?.id}`)
      }, 1500)
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al guardar los cambios",
      })
    } finally {
      setIsSaving(false)
    }
  }

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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push(`/product/${product.id}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-paw-brown">Edición de Producto</h1>
              <p className="text-gray-600">Modifica la información del producto</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-paw-brown">Imagen del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de la Imagen</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <Button type="button" variant="outline" className="w-full bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Subir Nueva Imagen
              </Button>
            </CardContent>
          </Card>

          {/* Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-paw-brown">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ingrese el nombre del producto"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Proveedor *</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange("supplier", e.target.value)}
                      placeholder="Ingrese el proveedor"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio de Venta *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stock Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-paw-brown">Información de Existencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Existencias Actuales *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minStock">Stock Mínimo *</Label>
                    <Input
                      id="minStock"
                      type="number"
                      min="0"
                      value={formData.minStock}
                      onChange={(e) => handleInputChange("minStock", e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Characteristics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-paw-brown">Características *</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.characteristics}
                  onChange={(e) => handleInputChange("characteristics", e.target.value)}
                  placeholder="Describe las características del producto..."
                  rows={4}
                  required
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="bg-paw-primary hover:bg-paw-blue text-white px-8">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
