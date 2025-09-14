"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { getProducts, getTopSellingProducts, getLowStockProducts } from "@/lib/products"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardTabs } from "@/components/dashboard-tabs"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paw-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paw-primary mx-auto"></div>
          <p className="mt-4 text-paw-brown">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const currentUser = getCurrentUser()
  const allProducts = getProducts()
  const topSellingProducts = getTopSellingProducts()
  const lowStockProducts = getLowStockProducts()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-paw-brown mb-2">Dashboard de Inventario</h1>
          <p className="text-gray-600">
            Bienvenido, {currentUser?.username}. Gestiona tu inventario de manera eficiente.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Productos</p>
                <p className="text-3xl font-bold text-paw-brown">{allProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-paw-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-paw-primary text-xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Agotándose</p>
                <p className="text-3xl font-bold text-paw-coral">{lowStockProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-paw-coral/10 rounded-lg flex items-center justify-center">
                <span className="text-paw-coral text-xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total Inventario</p>
                <p className="text-3xl font-bold text-paw-green-1">
                  ${allProducts.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-paw-green-1/10 rounded-lg flex items-center justify-center">
                <span className="text-paw-green-1 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tables */}
        <DashboardTabs
          allProducts={allProducts}
          topSellingProducts={topSellingProducts}
          lowStockProducts={lowStockProducts}
        />
      </div>
    </DashboardLayout>
  )
}
