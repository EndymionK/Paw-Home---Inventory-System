"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ProductTableProps {
  products: Product[]
  onProductClick: (productId: string) => void
  showStock?: boolean
  highlightLowStock?: boolean
}

export function ProductTable({
  products,
  onProductClick,
  showStock = false,
  highlightLowStock = false,
}: ProductTableProps) {
  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: "No disponible", variant: "destructive" as const }
    if (product.stock <= product.minStock) return { label: "Stock bajo", variant: "secondary" as const }
    return { label: "Disponible", variant: "default" as const }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-2xl">📦</span>
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h4>
        <p className="text-gray-600">No se encontraron productos en esta categoría</p>
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
            {showStock && (
              <>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Existencias</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product)
            return (
              <tr
                key={product.id}
                onClick={() => onProductClick(product.id)}
                className={cn(
                  "border-b border-gray-100 hover:bg-paw-primary/5 cursor-pointer transition-colors",
                  highlightLowStock && product.stock <= product.minStock && "bg-paw-coral/10",
                )}
              >
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
                {showStock && (
                  <>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <span className={cn("font-medium", product.stock <= product.minStock && "text-paw-coral")}>
                        {product.stock} unidades
                      </span>
                      {product.stock <= product.minStock && (
                        <p className="text-xs text-paw-coral mt-1">Mín: {product.minStock}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={stockStatus.variant} className="text-xs">
                        {stockStatus.label}
                      </Badge>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
