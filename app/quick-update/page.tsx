"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { getTopSellingProducts, updateProductStock, SALES_DATA, MOCK_PRODUCTS, type Product } from "@/lib/products"
import { DashboardLayout } from "@/components/dashboard-layout"
import { QuickUpdateCard } from "@/components/quick-update-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, CheckCircle, AlertCircle } from "lucide-react"

export default function QuickUpdatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([])
  const [leastSellingProducts, setLeastSellingProducts] = useState<Product[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    loadProducts()
    setIsLoading(false)
  }, [router])

  const loadProducts = () => {
    // Get top selling products
    const topSelling = getTopSellingProducts()

    // Get least selling products (reverse order of sales data)
    const leastSelling = SALES_DATA.sort((a, b) => a.sales - b.sales)
      .slice(0, 5)
      .map((sale) => MOCK_PRODUCTS.find((p) => p.id === sale.productId))
      .filter(Boolean) as Product[]

    setTopSellingProducts(topSelling.filter((p) => !p.isDeleted))
    setLeastSellingProducts(leastSelling.filter((p) => !p.isDeleted))
  }

  const handleStockUpdate = async (productId: string, newStock: number, productName: string) => {
    try {
      const success = updateProductStock(productId, newStock)
      if (success) {
        loadProducts()
        setMessage({
          type: "success",
          text: `Stock de "${productName}" actualizado a ${newStock} unidades`,
        })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error("No se pudo actualizar el stock")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error al actualizar el stock de "${productName}"`,
      })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    loadProducts()
    setIsRefreshing(false)
    setMessage({ type: "success", text: "Datos actualizados correctamente" })
    setTimeout(() => setMessage(null), 3000)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paw-primary mx-auto"></div>
            <p className="mt-4 text-paw-brown">Cargando actualización rápida...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-paw-brown">Actualización Rápida de Existencias</h1>
            <p className="text-gray-600">Ajusta rápidamente el stock de los productos más y menos vendidos</p>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-paw-primary text-paw-primary hover:bg-paw-primary hover:text-white bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualizando..." : "Actualizar Datos"}
          </Button>
        </div>

        {/* Messages */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productos Más Vendidos</p>
                  <p className="text-2xl font-bold text-paw-green-1">{topSellingProducts.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Productos con mayor rotación</p>
                </div>
                <div className="w-12 h-12 bg-paw-green-1/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-paw-green-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productos Menos Vendidos</p>
                  <p className="text-2xl font-bold text-paw-coral">{leastSellingProducts.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Productos con menor rotación</p>
                </div>
                <div className="w-12 h-12 bg-paw-coral/10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-paw-coral" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-paw-brown flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-paw-green-1" />
                Productos Más Vendidos
              </CardTitle>
              <p className="text-sm text-gray-600">Productos con mayor demanda y rotación en el inventario</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, index) => {
                  const salesData = SALES_DATA.find((s) => s.productId === product.id)
                  return (
                    <QuickUpdateCard
                      key={product.id}
                      product={product}
                      rank={index + 1}
                      salesCount={salesData?.sales || 0}
                      onStockUpdate={handleStockUpdate}
                      variant="top-selling"
                    />
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay datos de productos más vendidos</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Least Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-paw-brown flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-paw-coral" />
                Productos Menos Vendidos
              </CardTitle>
              <p className="text-sm text-gray-600">Productos con menor demanda que podrían necesitar promoción</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {leastSellingProducts.length > 0 ? (
                leastSellingProducts.map((product, index) => {
                  const salesData = SALES_DATA.find((s) => s.productId === product.id)
                  return (
                    <QuickUpdateCard
                      key={product.id}
                      product={product}
                      rank={index + 1}
                      salesCount={salesData?.sales || 0}
                      onStockUpdate={handleStockUpdate}
                      variant="least-selling"
                    />
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay datos de productos menos vendidos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <Card className="bg-paw-primary/5 border-paw-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-paw-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-paw-primary text-sm">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-paw-brown mb-2">Consejos para la Actualización Rápida</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Usa los botones + y - para ajustar rápidamente las existencias</li>
                  <li>• Los productos más vendidos pueden necesitar reposición frecuente</li>
                  <li>• Los productos menos vendidos podrían beneficiarse de promociones</li>
                  <li>• Los cambios se reflejan inmediatamente en el dashboard principal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
