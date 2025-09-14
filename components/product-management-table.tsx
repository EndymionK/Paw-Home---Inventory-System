"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Product } from "@/lib/products"
import { Eye, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductManagementTableProps {
  products: Product[]
  onDeleteProduct: (productId: string) => void
}

export function ProductManagementTable({ products, onDeleteProduct }: ProductManagementTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: "No disponible", variant: "destructive" as const }
    if (product.stock <= product.minStock) return { label: "Stock bajo", variant: "secondary" as const }
    return { label: "Disponible", variant: "default" as const }
  }

  const handleDelete = async (productId: string) => {
    setDeletingId(productId)
    try {
      await onDeleteProduct(productId)
    } finally {
      setDeletingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-2xl">📦</span>
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h4>
        <p className="text-gray-600">Intenta ajustar los filtros de búsqueda o crear un nuevo producto</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Proveedor</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Precio</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product)
            return (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-paw-primary/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.characteristics}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{product.supplier}</td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</td>
                <td className="py-4 px-4 text-sm text-gray-700">
                  <span className={cn("font-medium", product.stock <= product.minStock && "text-paw-coral")}>
                    {product.stock}
                  </span>
                  <span className="text-gray-500 ml-1">unidades</span>
                  {product.stock <= product.minStock && (
                    <p className="text-xs text-paw-coral mt-1">Mín: {product.minStock}</p>
                  )}
                </td>
                <td className="py-4 px-4">
                  <Badge variant={stockStatus.variant} className="text-xs">
                    {stockStatus.label}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="text-paw-primary hover:text-paw-blue hover:bg-paw-primary/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/product/${product.id}/edit`)}
                      className="text-paw-green-1 hover:text-paw-green-2 hover:bg-paw-green-1/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === product.id}
                          className="text-paw-coral hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar Producto</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar "{product.name}"? El producto será movido al historial
                            de productos eliminados y podrás recuperarlo más tarde si es necesario.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-paw-coral hover:bg-red-600"
                          >
                            Eliminar Producto
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
