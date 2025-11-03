"use client"

import { useState, useEffect } from "react"
import { Bell, Package, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { checkLowStockNotifications } from "@/lib/products"

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<{ product: any; message: string }[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkNotifications = () => {
      const lowStockNotifications = checkLowStockNotifications()
      setNotifications(lowStockNotifications)
      if (!isOpen) {
        setUnreadCount(lowStockNotifications.length)
      }
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 30000)

    return () => clearInterval(interval)
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setUnreadCount(0)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center gap-2 px-2 py-1 rounded bg-white text-black"
          aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} nuevas)` : ""}`}
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Notificaciones</span>
          {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm text-gray-900">Notificaciones</h3>
          {notifications.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {notifications.length} {notifications.length === 1 ? "notificación nueva" : "notificaciones nuevas"}
            </p>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No hay notificaciones</p>
              <p className="text-xs text-gray-400 mt-1">Todos los productos tienen stock suficiente</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification, index) => (
                <div
                  key={`${notification.product.id}-${index}`}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle
                      className={`w-4 h-4 ${notification.product.stock === 0 ? "text-red-500" : "text-yellow-500"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notification.product.stock === 0 ? "Producto agotado" : "Producto por debajo del stock mínimo"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={notification.product.stock === 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {notification.product.stock === 0 ? "Sin stock" : `${notification.product.stock} unidades`}
                      </Badge>
                      <span className="text-xs text-gray-400">Mínimo: {notification.product.minStock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              Revisa la gestión de productos para actualizar el inventario
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
