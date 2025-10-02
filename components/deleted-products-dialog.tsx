"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { RotateCcw, Calendar } from "lucide-react"

interface DeletedProductsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deletedProducts: Product[]
  onRestoreProduct: (productId: string) => void
}

export function DeletedProductsDialog({
  open,
  onOpenChange,
  deletedProducts,
  onRestoreProduct,
}: DeletedProductsDialogProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const handleRestore = async (productId: string) => {
    setRestoringId(productId)
    try {
      await onRestoreProduct(productId)
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-paw-brown">Historial de Productos Eliminados</DialogTitle>
          <DialogDescription>
            Productos que han sido eliminados del inventario activo. Puedes recuperarlos cuando sea necesario.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {deletedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🗑️</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No hay productos eliminados</h4>
              <p className="text-gray-600">Los productos eliminados aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deletedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{product.supplier}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>Precio: ${product.price.toFixed(2)}</span>
                      <span>Stock: {product.stock} unidades</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Eliminado: {product.updatedAt.toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={restoringId === product.id}
                        className="border-paw-green-1 text-paw-green-1 hover:bg-paw-green-1 hover:text-white bg-transparent"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Recuperar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Recuperar Producto</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que deseas recuperar "{product.name}"? El producto será restaurado al
                          inventario activo con toda su información original.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRestore(product.id)}
                          className="bg-paw-green-1 hover:bg-paw-green-2"
                        >
                          Recuperar Producto
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
