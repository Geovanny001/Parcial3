"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, CreditCard, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Drawer } from "vaul"  // Instala con npm i vaul si no tienes
import { obtenerProductos, agregarAlCarrito, obtenerCarrito, checkoutCarrito } from "@/lib/api"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen: string
}

interface ItemCarrito {
  id: number
  idProducto: number
  nombre: string
  precio: number
  cantidad: number
  subtotal: number
}

export default function TiendaPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [carritoItems, setCarritoItems] = useState<ItemCarrito[]>([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [showDrawer, setShowDrawer] = useState(false)  // ← State para abrir drawer
  const [cargandoCarrito, setCargandoCarrito] = useState(false)
  const idUsuario = 1  // Demo

  useEffect(() => {
  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();  // Llama backend real
      const mapped = data.map((p: any) => ({
        ...p,
        descripcion: p.descripcion || "Descripción del producto",  // Placeholder
        stock: p.stock || p.inventario || 0,  // Map a stock
        imagen: p.imagen || "/placeholder.svg"  // Placeholder
      }));
      setProductos(mapped);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  cargarProductos();
}, []);

  const agregarProductoAlCarrito = async (producto: Producto) => {
    console.log("Agregando producto:", producto.id)  // Debug log
    try {
      await agregarAlCarrito(idUsuario, producto.id, 1)  // Llama backend
      console.log("Agregado OK, refrescando carrito...")  // Debug
      const res = await obtenerCarrito(idUsuario)
      console.log("Res carrito:", res)  // Debug: Ve items/total en console
      setCarritoItems(res.items || [])
      setTotal(res.total || 0)
      alert(`${producto.nombre} agregado al carrito (${res.items ? res.items.length : 0} items)`)
    } catch (error) {
      console.error("Error agregar:", error)  // Debug
      alert('Error al agregar: ' + (error as Error).message)
    }
  }

  const abrirCarrito = async () => {
    console.log("Abriendo carrito...")  // Debug
    setCargandoCarrito(true)
    try {
      const res = await obtenerCarrito(idUsuario)
      console.log("Carrito cargado:", res)  // Debug: Ve si items llegan
      setCarritoItems(res.items || [])
      setTotal(res.total || 0)
      setShowDrawer(true)  // ← Esto abre el drawer
    } catch (error) {
      console.error("Error abrir carrito:", error)  // Debug
      alert('Error al cargar carrito: ' + (error as Error).message)
    } finally {
      setCargandoCarrito(false)
    }
  }

  const realizarCheckout = async () => {
    try {
      const res = await checkoutCarrito(idUsuario)
      alert(`¡Pago exitoso! Total: $${res.total.toFixed(2)}`)
      setCarritoItems([])
      setTotal(0)
      setShowDrawer(false)
    } catch (error) {
      alert('Error en pago: ' + (error as Error).message)
    }
  }

  const removerItem = (idItem: number) => {
    alert('Item removido (simulado)')  // Para simplicidad
    setCarritoItems((prev) => prev.filter(item => item.id !== idItem))
    setTotal(0)  // Recalcula si quieres
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Admin
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-foreground">Mi Tienda</h1>
            </div>
            <Button variant="outline" size="sm" onClick={abrirCarrito}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrito ({carritoItems.length})
              {total > 0 && <Badge className="ml-2">${total.toFixed(2)}</Badge>}
            </Button>
          </div>
        </div>
      </header>

      {/* Productos Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Productos Disponibles</h2>
          <p className="text-sm text-muted-foreground">Explora nuestro catálogo de productos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <Card key={producto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted relative">
                <img
                  src={producto.imagen || "/placeholder.svg"}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
                {producto.stock < 10 && producto.stock > 0 && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    ¡Últimas unidades!
                  </Badge>
                )}
                {producto.stock === 0 && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    Agotado
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{producto.nombre}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{producto.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">${producto.precio.toFixed(2)}</span>
                  <Button size="sm" onClick={() => agregarProductoAlCarrito(producto)} disabled={producto.stock === 0}>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Stock: {producto.stock} unidades</p>
              </div>
            </Card>
          ))}
        </div>

        {productos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay productos disponibles</p>
          </div>
        )}
      </main>

      {/* Drawer del Carrito con Vaul (Animado – Se Abre con Items) */}
      <Drawer.Root open={showDrawer} onOpenChange={setShowDrawer}>
        <Drawer.Portal>
          <Drawer.Content className="flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0 z-50 bg-background">
            <div className="p-4 bg-background rounded-t-[10px] flex-1">
              <div className="mx-auto w-8 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
              <div className="flex-1">
                <Drawer.Title className="font-semibold text-lg mb-4">Mi Carrito ({carritoItems.length} items)</Drawer.Title>
                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                  {carritoItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Carrito vacío – agrega productos arriba</p>
                  ) : (
                    carritoItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.nombre}</h4>
                          <p className="text-sm text-muted-foreground">x{item.cantidad} @ ${item.precio.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => removerItem(item.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t p-3 text-sm font-semibold">
                  Total: ${total.toFixed(2)}
                </div>
                <Drawer.Close asChild>
                  <Button onClick={realizarCheckout} className="w-full mt-4 gap-2" disabled={carritoItems.length === 0 || cargandoCarrito}>
                    {cargandoCarrito ? "Procesando..." : <CreditCard className="w-4 h-4" />}
                    Pagar ${total.toFixed(2)}
                  </Button>
                </Drawer.Close>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}