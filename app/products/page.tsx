"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import {
  getProducts,
  getDeletedProducts,
  deleteProduct,
  restoreProduct,
  MOCK_PRODUCTS,
  type Product,
  createProduct,
  fetchProducts,
  convertBackendToFrontend,
  deleteProductAPI,
} from "@/lib/products"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProductManagementTable } from "@/components/product-management-table"
import { CreateProductDialog } from "@/components/create-product-dialog"
import { DeletedProductsDialog } from "@/components/deleted-products-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Filter, Trash2, CheckCircle, AlertCircle } from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeletedDialogOpen, setIsDeletedDialogOpen] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    loadProducts()
    setIsLoading(false)
  }, [router])

  const loadProducts = () => {
    const activeProducts = getProducts()
    const deletedProductsList = getDeletedProducts()
    setProducts(activeProducts)
    setDeletedProducts(deletedProductsList)
    setFilteredProducts(activeProducts)
  }

  // Filter and search products
  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.characteristics.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (filterBy !== "all") {
      switch (filterBy) {
        case "low-stock":
          filtered = filtered.filter((product) => product.stock <= product.minStock)
          break
        case "out-of-stock":
          filtered = filtered.filter((product) => product.stock === 0)
          break
        case "available":
          filtered = filtered.filter((product) => product.stock > product.minStock)
          break
      }
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, filterBy])

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Convert string ID to number (codigo)
      const codigo = parseInt(productId)
      if (isNaN(codigo)) {
        throw new Error("ID de producto inválido")
      }

      await deleteProductAPI(codigo)
      
      // Reload products from backend
      const backendProducts = await fetchProducts()
      const convertedProducts = backendProducts.map(convertBackendToFrontend)
      setProducts(convertedProducts)
      setFilteredProducts(convertedProducts)
      
      setMessage({ type: "success", text: "Producto eliminado exitosamente" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Error al eliminar el producto" 
      })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleRestoreProduct = async (productId: string) => {
    try {
      const success = restoreProduct(productId)
      if (success) {
        loadProducts()
        setMessage({ type: "success", text: "Producto recuperado exitosamente" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error("No se pudo recuperar el producto")
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al recuperar el producto" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleCreateProduct = async (newProduct: Omit<Product, "id" | "isDeleted" | "createdAt" | "updatedAt">) => {
    try {
      // Convert frontend format to backend format
      const backendData = {
        nombre: newProduct.name,
        cantidad: newProduct.stock,
        precio: newProduct.price,
        idProveedor: typeof newProduct.supplier === 'number' ? newProduct.supplier : 1, // Use hash or default to 1
        umbralMinimo: newProduct.minStock > 0 ? newProduct.minStock : undefined,
        imagen: newProduct.image || undefined,
        descripcion: newProduct.characteristics || undefined,
      }

      const createdProduct = await createProduct(backendData)
      
      // Reload products from backend
      const backendProducts = await fetchProducts()
      const convertedProducts = backendProducts.map(convertBackendToFrontend)
      setProducts(convertedProducts)
      setFilteredProducts(convertedProducts)
      
      setMessage({ type: "success", text: "Producto creado exitosamente" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error al crear producto:", error)
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Error al crear el producto" 
      })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paw-primary mx-auto"></div>
            <p className="mt-4 text-paw-brown">Cargando productos...</p>
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
            <h1 className="text-2xl font-bold text-paw-brown">Gestión de Productos</h1>
            <p className="text-gray-600">Administra tu inventario de productos</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeletedDialogOpen(true)}
              className="border-paw-coral text-paw-coral hover:bg-paw-coral hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Historial ({deletedProducts.length})
            </Button>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-paw-primary hover:bg-paw-blue text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold text-paw-brown">{products.length}</p>
                </div>
                <div className="w-8 h-8 bg-paw-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-paw-primary text-sm">📦</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-paw-coral">
                    {products.filter((p) => p.stock <= p.minStock && p.stock > 0).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-paw-coral/10 rounded-lg flex items-center justify-center">
                  <span className="text-paw-coral text-sm">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agotados</p>
                  <p className="text-2xl font-bold text-red-600">{products.filter((p) => p.stock === 0).length}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-sm">❌</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Eliminados</p>
                  <p className="text-2xl font-bold text-gray-600">{deletedProducts.length}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-sm">🗑️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar productos por nombre, proveedor o características..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los productos</SelectItem>
                    <SelectItem value="available">Disponibles</SelectItem>
                    <SelectItem value="low-stock">Stock bajo</SelectItem>
                    <SelectItem value="out-of-stock">Agotados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-paw-brown">Productos ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductManagementTable products={filteredProducts} onDeleteProduct={handleDeleteProduct} />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <CreateProductDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateProduct={handleCreateProduct}
        />

        <DeletedProductsDialog
          open={isDeletedDialogOpen}
          onOpenChange={setIsDeletedDialogOpen}
          deletedProducts={deletedProducts}
          onRestoreProduct={handleRestoreProduct}
        />
      </div>
    </DashboardLayout>
  )
}
