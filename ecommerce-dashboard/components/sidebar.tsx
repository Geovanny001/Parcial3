"use client"

import { BarChart3, Package, ShoppingCart, Users, Settings, Home, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navegacionAdmin = [
  { nombre: "Dashboard", icono: Home, href: "/" },
  { nombre: "Productos", icono: Package, href: "/productos" },
  { nombre: "Pedidos", icono: ShoppingCart, href: "/pedidos" },
  { nombre: "Configuración", icono: Settings, href: "/configuracion" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow border-r border-border bg-card pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">E-Commerce</span>
          </div>
        </div>

        <div className="px-4 mb-4">
          <Link
            href="/tienda"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Store className="w-4 h-4" />
            Ver Tienda
          </Link>
        </div>

        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Administración</p>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navegacionAdmin.map((item) => {
            const estaActivo = pathname === item.href
            return (
              <Link
                key={item.nombre}
                href={item.href}
                className={cn(
                  estaActivo
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                )}
              >
                <item.icono
                  className={cn(
                    estaActivo ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                    "mr-3 flex-shrink-0 h-5 w-5",
                  )}
                />
                {item.nombre}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
