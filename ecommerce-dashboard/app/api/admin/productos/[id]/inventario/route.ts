import { NextResponse } from "next/server"
import { actualizarProductoInventario } from "@/lib/mock-data"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { cantidad } = await request.json()

    if (cantidad === undefined) {
      return NextResponse.json({ error: "Falta la cantidad" }, { status: 400 })
    }

    const producto = actualizarProductoInventario(Number.parseInt(id), cantidad)
    return NextResponse.json(producto)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar inventario" }, { status: 500 })
  }
}
