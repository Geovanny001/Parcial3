import { NextResponse } from "next/server"
import { eliminarProductoById } from "@/lib/mock-data"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    eliminarProductoById(Number.parseInt(id))
    return NextResponse.json({ mensaje: "Producto eliminado" })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
