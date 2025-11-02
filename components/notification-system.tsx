"use client"

import { useState, useEffect } from "react"
import { Bell, Package, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { fetchNotificaciones, type NotificacionBackend } from "@/lib/products"

export function NotificationSystem() {
  const [notificaciones, setNotificaciones] = useState<NotificacionBackend[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkNotifications = async () => {
      const notificacionesActivas = await fetchNotificaciones()
      setNotificaciones(notificacionesActivas)
      if (!isOpen) {
        setUnreadCount(notificacionesActivas.length)
      }
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 30000) // Actualizar cada 30 segundos

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
          {notificaciones.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {notificaciones.length} {notificaciones.length === 1 ? "notificación nueva" : "notificaciones nuevas"}
            </p>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto">
          {notificaciones.length === 0 ? (
            <div className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No hay notificaciones</p>
              <p className="text-xs text-gray-400 mt-1">Todos los productos tienen stock suficiente</p>
            </div>
          ) : (
            <div className="py-2">
              {notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle
                      className={`w-4 h-4 ${notificacion.stockActual === 0 ? "text-red-500" : "text-yellow-500"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notificacion.stockActual === 0 ? "Producto agotado" : "Producto por debajo del stock mínimo"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notificacion.stockActual === 0
                        ? `${notificacion.nombreProducto} está agotado`
                        : `${notificacion.nombreProducto} tiene stock bajo (${notificacion.stockActual} unidades)`}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={notificacion.stockActual === 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {notificacion.stockActual === 0 ? "Sin stock" : `${notificacion.stockActual} unidades`}
                      </Badge>
                      <span className="text-xs text-gray-400">Mínimo: {notificacion.umbralMinimo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notificaciones.length > 0 && (
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
