import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ idUsuario: string }> }) {
  try {
    const { idUsuario } = await params

    // Mock: devolver carrito vacío
    return NextResponse.json({
      items: [],
      total: 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener carrito" }, { status: 500 })
  }
}
