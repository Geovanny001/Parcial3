"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Producto, crearProducto, eliminarProducto } from "@/lib/api"
import { Plus, Trash2, Package } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ProductosTableProps {
  productos: Producto[]
}

export function ProductosTable({ productos: productosIniciales }: ProductosTableProps) {
  const router = useRouter()
  const [productos, setProductos] = useState(productosIniciales)
  const [estaAgregando, setEstaAgregando] = useState(false)
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "", inventario: "" })
  const [cargando, setCargando] = useState(false)

  const manejarCrear = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.inventario) return

    setCargando(true)
    try {
      const producto = await crearProducto(
        nuevoProducto.nombre,
        Number.parseFloat(nuevoProducto.precio),
        Number.parseInt(nuevoProducto.inventario),
      )
      setProductos([...productos, producto])
      setNuevoProducto({ nombre: "", precio: "", inventario: "" })
      setEstaAgregando(false)
      router.refresh()
    } catch (error) {
      console.error("Error al crear producto:", error)
      alert("Error al crear producto")
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    setCargando(true)
    try {
      await eliminarProducto(id)
      setProductos(productos.filter((p) => p.id !== id))
      router.refresh()
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      alert("Error al eliminar producto")
    } finally {
      setCargando(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Gestión de Productos</CardTitle>
            <CardDescription className="text-muted-foreground">Administra tu catálogo de productos</CardDescription>
          </div>
          <Button onClick={() => setEstaAgregando(!estaAgregando)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {estaAgregando && (
          <div className="mb-6 p-4 border border-border rounded-lg bg-secondary/30">
            <h3 className="text-sm font-medium text-foreground mb-4">Nuevo Producto</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="inventario">Inventario</Label>
                <Input
                  id="inventario"
                  type="number"
                  value={nuevoProducto.inventario}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, inventario: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={manejarCrear} disabled={cargando}>
                {cargando ? "Creando..." : "Crear Producto"}
              </Button>
              <Button variant="outline" onClick={() => setEstaAgregando(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {productos.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay productos aún</p>
            </div>
          ) : (
            productos.map((producto) => (
              <div
                key={producto.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{producto.nombre}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Precio:{" "}
                      <span className="text-primary font-medium">
                        ${Number.parseFloat(producto.precio.toString()).toFixed(2)}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock: <span className="text-foreground font-medium">{producto.inventario}</span>
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => manejarEliminar(producto.id)}
                  disabled={cargando}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
