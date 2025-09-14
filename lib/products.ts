// Product data types and mock data for the inventory system
export interface Product {
  id: string
  name: string
  supplier: string
  price: number
  stock: number
  minStock: number
  image: string
  characteristics: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock product data
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Alimento Premium para Perros",
    supplier: "Pet Food Co.",
    price: 45.99,
    stock: 25,
    minStock: 10,
    image: "/dog-food-bag.jpg",
    characteristics: "Alimento balanceado para perros adultos, rico en proteínas y vitaminas",
    isDeleted: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Collar Ajustable para Gatos",
    supplier: "Pet Accessories Ltd.",
    price: 12.5,
    stock: 8,
    minStock: 15,
    image: "/placeholder-1i1wf.png",
    characteristics: "Collar ajustable de nylon con cascabel, disponible en varios colores",
    isDeleted: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Juguete Interactivo para Perros",
    supplier: "Fun Pet Toys",
    price: 18.75,
    stock: 32,
    minStock: 20,
    image: "/placeholder-nnijs.png",
    characteristics: "Juguete de goma resistente con sonido, ideal para perros medianos y grandes",
    isDeleted: false,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "4",
    name: "Arena para Gatos Premium",
    supplier: "Clean Litter Inc.",
    price: 22.3,
    stock: 5,
    minStock: 12,
    image: "/placeholder-c2ocr.png",
    characteristics: "Arena aglomerante con control de olores, 10kg",
    isDeleted: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "5",
    name: "Cama Ortopédica para Mascotas",
    supplier: "Comfort Pet Beds",
    price: 89.99,
    stock: 15,
    minStock: 8,
    image: "/placeholder-e0etb.png",
    characteristics: "Cama de espuma viscoelástica, lavable, tamaño mediano",
    isDeleted: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-19"),
  },
]

// Sales data for analytics
export const SALES_DATA = [
  { productId: "3", sales: 45 },
  { productId: "1", sales: 38 },
  { productId: "5", sales: 22 },
  { productId: "2", sales: 15 },
  { productId: "4", sales: 12 },
]

export function getProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => !p.isDeleted)
}

export function getDeletedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isDeleted)
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}

export function getTopSellingProducts(): Product[] {
  const topSelling = SALES_DATA.sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map((sale) => MOCK_PRODUCTS.find((p) => p.id === sale.productId))
    .filter(Boolean) as Product[]

  return topSelling.filter((p) => !p.isDeleted)
}

export function getLeastSellingProducts(): Product[] {
  const leastSelling = SALES_DATA.sort((a, b) => a.sales - b.sales)
    .slice(0, 5)
    .map((sale) => MOCK_PRODUCTS.find((p) => p.id === sale.productId))
    .filter(Boolean) as Product[]

  return leastSelling.filter((p) => !p.isDeleted)
}

export function getLowStockProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => !p.isDeleted && p.stock <= p.minStock).sort((a, b) => a.stock - b.stock)
}

export function checkLowStockNotifications(): { product: Product; message: string }[] {
  const notifications: { product: Product; message: string }[] = []

  MOCK_PRODUCTS.forEach((product) => {
    if (!product.isDeleted && product.stock <= product.minStock) {
      notifications.push({
        product,
        message:
          product.stock === 0
            ? `${product.name} está agotado`
            : `${product.name} tiene stock bajo (${product.stock} unidades)`,
      })
    }
  })

  return notifications
}

export function updateProductStock(id: string, newStock: number): boolean {
  const product = MOCK_PRODUCTS.find((p) => p.id === id)
  if (product) {
    product.stock = Math.max(0, newStock)
    product.updatedAt = new Date()
    return true
  }
  return false
}

export function deleteProduct(id: string): boolean {
  const product = MOCK_PRODUCTS.find((p) => p.id === id)
  if (product) {
    product.isDeleted = true
    product.updatedAt = new Date()
    return true
  }
  return false
}

export function restoreProduct(id: string): boolean {
  const product = MOCK_PRODUCTS.find((p) => p.id === id)
  if (product) {
    product.isDeleted = false
    product.updatedAt = new Date()
    return true
  }
  return false
}

export function getInventoryStats() {
  const activeProducts = getProducts()
  const totalValue = activeProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStockCount = activeProducts.filter((p) => p.stock <= p.minStock && p.stock > 0).length
  const outOfStockCount = activeProducts.filter((p) => p.stock === 0).length
  const availableCount = activeProducts.filter((p) => p.stock > p.minStock).length

  return {
    totalProducts: activeProducts.length,
    totalValue,
    lowStockCount,
    outOfStockCount,
    availableCount,
    deletedCount: getDeletedProducts().length,
  }
}
