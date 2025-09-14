"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUser, logout } from "@/lib/auth"
import { LayoutDashboard, Package, Zap, User, LogOut, Menu, X, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationSystem } from "@/components/notification-system"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = getCurrentUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navigationItems = [
    { href: "/login", label: "Inicio de Sesión", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Gestión de Productos", icon: Package },
    { href: "/quick-update", label: "Actualización Rápida de Existencias", icon: Zap },
  ]

  const isActivePath = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-paw-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 min-w-0">
              <Image
                src="/images/paw-home-logo.png"
                alt="Logotipo de Paw & Home"
                width={40}
                height={40}
                className="object-contain shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-paw-brown truncate">Paw & Home</h1>
                <p className="text-sm text-gray-600 truncate">Sistema de Inventario</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Navegación principal">
              {navigationItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActivePath(item.href)
                      ? "bg-paw-primary text-white"
                      : "text-gray-700 hover:text-paw-primary hover:bg-paw-primary/10",
                  )}
                  aria-current={isActivePath(item.href) ? "page" : undefined}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Notification System */}
              <NotificationSystem />

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded bg-white text-black">
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{currentUser?.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-900">{currentUser?.username}</div>
                  <div className="px-2 py-1.5 text-xs text-gray-500">Administrador</div>
                  <DropdownMenuSeparator />
                  {navigationItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 w-full">
                        <item.icon className="w-4 h-4" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden border-t bg-white"
              role="navigation"
              aria-label="Navegación móvil"
            >
              <nav className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      isActivePath(item.href)
                        ? "bg-paw-primary text-white"
                        : "text-gray-700 hover:text-paw-primary hover:bg-paw-primary/10",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActivePath(item.href) ? "page" : undefined}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-paw-primary text-white py-6 mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src="/images/paw-home-logo.png"
                alt="Logotipo de Paw & Home"
                width={40}
                height={40}
                className="object-contain shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-paw-brown truncate">Paw & Home</h1>
                <p className="text-xs text-gray-600 truncate">Sistema de Inventario</p>
              </div>
            </div>

            <div className="text-xs text-white/80 text-center md:text-right">
              <p>Desarrollado con Next.js y Tailwind CSS</p>
              <p>Cumple con estándares WCAG AA de accesibilidad</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
