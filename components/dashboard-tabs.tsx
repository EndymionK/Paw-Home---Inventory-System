"use client"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductTable } from "@/components/product-table"
import type { Product } from "@/lib/products"

interface DashboardTabsProps {
  allProducts: Product[]
  topSellingProducts: Product[]
  lowStockProducts: Product[]
}

export function DashboardTabs({ allProducts, topSellingProducts, lowStockProducts }: DashboardTabsProps) {
  const router = useRouter()

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Tabs defaultValue="current-stock" className="w-full">
        <div className="border-b bg-paw-primary/5">
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0">
            <TabsTrigger
              value="current-stock"
              className="data-[state=active]:bg-paw-primary data-[state=active]:text-white py-4 text-sm font-medium"
            >
              Existencias Actuales
            </TabsTrigger>
            <TabsTrigger
              value="top-selling"
              className="data-[state=active]:bg-paw-primary data-[state=active]:text-white py-4 text-sm font-medium"
            >
              Productos Más Vendidos
            </TabsTrigger>
            <TabsTrigger
              value="low-stock"
              className="data-[state=active]:bg-paw-primary data-[state=active]:text-white py-4 text-sm font-medium"
            >
              Productos a Reponer
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="current-stock" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-paw-brown mb-2">Existencias Actuales</h3>
                <p className="text-sm text-gray-600">Vista completa de todos los productos en inventario</p>
              </div>
              <ProductTable products={allProducts} onProductClick={handleProductClick} showStock={true} />
            </div>
          </TabsContent>

          <TabsContent value="top-selling" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-paw-brown mb-2">Productos Más Vendidos</h3>
                <p className="text-sm text-gray-600">Los productos con mayor rotación en el inventario</p>
              </div>
              <ProductTable products={topSellingProducts} onProductClick={handleProductClick} showStock={true} />
            </div>
          </TabsContent>

          <TabsContent value="low-stock" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-paw-brown mb-2">Productos a Reponer</h3>
                <p className="text-sm text-gray-600">Productos que han alcanzado o están por debajo del stock mínimo</p>
              </div>
              {lowStockProducts.length > 0 ? (
                <ProductTable
                  products={lowStockProducts}
                  onProductClick={handleProductClick}
                  showStock={true}
                  highlightLowStock={true}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-paw-green-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-paw-green-1 text-2xl">✓</span>
                  </div>
                  <h4 className="text-lg font-medium text-paw-brown mb-2">¡Excelente!</h4>
                  <p className="text-gray-600">Todos los productos tienen stock suficiente</p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
