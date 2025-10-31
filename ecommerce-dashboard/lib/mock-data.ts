// Mock data para simular la base de datos
import type { Producto, Pedido } from "./api"

export const mockProductos: Producto[] = [
  { id: 1, nombre: "Laptop Pro", precio: 1299.99, inventario: 15 },
  { id: 2, nombre: "Mouse Inalámbrico", precio: 29.99, inventario: 50 },
  { id: 3, nombre: "Teclado Mecánico", precio: 89.99, inventario: 30 },
  { id: 4, nombre: "Monitor 4K", precio: 449.99, inventario: 20 },
  { id: 5, nombre: "Webcam HD", precio: 79.99, inventario: 25 },
  { id: 6, nombre: "Auriculares Bluetooth", precio: 149.99, inventario: 40 },
]

export const mockPedidos: Pedido[] = [
  {
    id: 1,
    idProducto: 1,
    cantidad: 2,
    total: 2599.98,
    estado: "completado",
    Producto: mockProductos[0],
  },
  {
    id: 2,
    idProducto: 2,
    cantidad: 5,
    total: 149.95,
    estado: "pendiente",
    Producto: mockProductos[1],
  },
  {
    id: 3,
    idProducto: 3,
    cantidad: 3,
    total: 269.97,
    estado: "completado",
    Producto: mockProductos[2],
  },
  {
    id: 4,
    idProducto: 4,
    cantidad: 1,
    total: 449.99,
    estado: "enviado",
    Producto: mockProductos[3],
  },
  {
    id: 5,
    idProducto: 5,
    cantidad: 4,
    total: 319.96,
    estado: "completado",
    Producto: mockProductos[4],
  },
  {
    id: 6,
    idProducto: 6,
    cantidad: 2,
    total: 299.98,
    estado: "pendiente",
    Producto: mockProductos[5],
  },
  {
    id: 7,
    idProducto: 1,
    cantidad: 1,
    total: 1299.99,
    estado: "completado",
    Producto: mockProductos[0],
  },
  {
    id: 8,
    idProducto: 3,
    cantidad: 2,
    total: 179.98,
    estado: "enviado",
    Producto: mockProductos[2],
  },
]

// Funciones helper para manipular los datos
let productos = [...mockProductos]
const pedidos = [...mockPedidos]
let nextProductoId = 7
let nextPedidoId = 9

export function getProductos() {
  return productos
}

export function getProductoPorId(id: number) {
  return productos.find((p) => p.id === id)
}

export function getPedidos() {
  return pedidos
}

export function agregarProducto(nombre: string, precio: number, inventario: number) {
  const nuevoProducto: Producto = {
    id: nextProductoId++,
    nombre,
    precio,
    inventario,
  }
  productos.push(nuevoProducto)
  return nuevoProducto
}

export function actualizarProductoInventario(id: number, cantidad: number) {
  const producto = productos.find((p) => p.id === id)
  if (!producto) throw new Error("Producto no encontrado")
  producto.inventario = cantidad
  return producto
}

export function eliminarProductoById(id: number) {
  productos = productos.filter((p) => p.id !== id)
}

export function agregarPedido(idProducto: number, cantidad: number) {
  const producto = productos.find((p) => p.id === idProducto)
  if (!producto) throw new Error("Producto no encontrado")

  const nuevoPedido: Pedido = {
    id: nextPedidoId++,
    idProducto,
    cantidad,
    total: producto.precio * cantidad,
    estado: "pendiente",
    Producto: producto,
  }
  pedidos.push(nuevoPedido)
  return nuevoPedido
}
