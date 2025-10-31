import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idUsuario, idProducto, cantidad } = await request.json()

    if (!idUsuario || !idProducto || !cantidad) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Mock: simular agregar al carrito
    const carritoItem = {
      id: Math.floor(Math.random() * 1000),
      idProducto,
      cantidad,
      nombre: "Producto Mock",
      precio: 99.99,
      subtotal: 99.99 * cantidad,
    }

    return NextResponse.json([carritoItem])
  } catch (error) {
    return NextResponse.json({ error: "Error al agregar al carrito" }, { status: 500 })
  }
}
