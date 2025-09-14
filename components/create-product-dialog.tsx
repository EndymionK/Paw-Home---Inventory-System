"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product } from "@/lib/products"
import { AlertCircle, Plus } from "lucide-react"

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProduct: (product: Omit<Product, "id" | "isDeleted" | "createdAt" | "updatedAt">) => void
}

export function CreateProductDialog({ open, onOpenChange, onCreateProduct }: CreateProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    supplier: "",
    price: "",
    stock: "",
    minStock: "",
    image: "",
    characteristics: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const resetForm = () => {
    setFormData({
      name: "",
      supplier: "",
      price: "",
      stock: "",
      minStock: "",
      image: "",
      characteristics: "",
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

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
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newProduct = {
        name: formData.name.trim(),
        supplier: formData.supplier.trim(),
        price: price,
        stock: stock,
        minStock: minStock,
        image: formData.image || "/placeholder.svg?key=new-product",
        characteristics: formData.characteristics.trim(),
      }

      onCreateProduct(newProduct)
      resetForm()
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al crear el producto")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-paw-brown">Crear Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa la información del nuevo producto para agregarlo al inventario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nombre del Producto *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ingrese el nombre del producto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-supplier">Proveedor *</Label>
              <Input
                id="create-supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Ingrese el proveedor"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-price">Precio de Venta *</Label>
            <Input
              id="create-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-stock">Existencias Iniciales *</Label>
              <Input
                id="create-stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-minStock">Stock Mínimo *</Label>
              <Input
                id="create-minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-image">URL de la Imagen</Label>
            <Input
              id="create-image"
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-characteristics">Características *</Label>
            <Textarea
              id="create-characteristics"
              value={formData.characteristics}
              onChange={(e) => handleInputChange("characteristics", e.target.value)}
              placeholder="Describe las características del producto..."
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-paw-primary hover:bg-paw-blue text-white">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Producto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
