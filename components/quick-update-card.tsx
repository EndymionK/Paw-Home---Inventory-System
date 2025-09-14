"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/products"
import { Plus, Minus, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickUpdateCardProps {
  product: Product
  rank: number
  salesCount: number
  onStockUpdate: (productId: string, newStock: number, productName: string) => void
  variant: "top-selling" | "least-selling"
}

export function QuickUpdateCard({ product, rank, salesCount, onStockUpdate, variant }: QuickUpdateCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const getStockStatus = () => {
    if (product.stock === 0) return { label: "No disponible", variant: "destructive" as const }
    if (product.stock <= product.minStock) return { label: "Stock bajo", variant: "secondary" as const }
    return { label: "Disponible", variant: "default" as const }
  }

  const handleStockChange = async (increment: number) => {
    const newStock = Math.max(0, product.stock + increment)
    setIsUpdating(true)

    try {
      await onStockUpdate(product.id, newStock, product.name)
      // Update local state optimistically
      product.stock = newStock
    } finally {
      setIsUpdating(false)
    }
  }

  const stockStatus = getStockStatus()
  const isTopSelling = variant === "top-selling"

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isTopSelling ? "border-paw-green-1/20 bg-paw-green-1/5" : "border-paw-coral/20 bg-paw-coral/5",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
              isTopSelling ? "bg-paw-green-1" : "bg-paw-coral",
            )}
          >
            #{rank}
          </div>

          {/* Product Image */}
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 text-sm truncate flex-1">{product.name}</h4>
              {isTopSelling ? (
                <TrendingUp className="w-3 h-3 text-paw-green-1 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 text-paw-coral flex-shrink-0" />
              )}
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs text-gray-500">
              <span className="truncate">Ventas: {salesCount}</span>
              <span className="hidden xs:inline">•</span>
              <span className="truncate">Precio: ${product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Stock Controls */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 flex-wrap">
              <Badge variant={stockStatus.variant} className="text-xs w-fit">
                {stockStatus.label}
              </Badge>
              <span className="text-sm font-medium text-gray-700 truncate">
                {product.stock} unidades (Mín: {product.minStock})
              </span>
            </div>

            <div className="flex items-center gap-1 justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStockChange(-1)}
                disabled={isUpdating || product.stock === 0}
                className="w-8 h-8 p-0 border-paw-coral text-paw-coral hover:bg-paw-coral hover:text-white flex-shrink-0"
              >
                <Minus className="w-3 h-3" />
              </Button>

              <div className="w-12 text-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-900">{product.stock}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStockChange(1)}
                disabled={isUpdating}
                className={cn(
                  "w-8 h-8 p-0 flex-shrink-0",
                  isTopSelling
                    ? "border-paw-green-1 text-paw-green-1 hover:bg-paw-green-1 hover:text-white"
                    : "border-paw-primary text-paw-primary hover:bg-paw-primary hover:text-white",
                )}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStockChange(5)}
              disabled={isUpdating}
              className="flex-1 text-xs h-7 text-paw-green-1 hover:bg-paw-green-1/10"
            >
              +5
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStockChange(10)}
              disabled={isUpdating}
              className="flex-1 text-xs h-7 text-paw-green-1 hover:bg-paw-green-1/10"
            >
              +10
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStockChange(-5)}
              disabled={isUpdating || product.stock < 5}
              className="flex-1 text-xs h-7 text-paw-coral hover:bg-paw-coral/10"
            >
              -5
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
