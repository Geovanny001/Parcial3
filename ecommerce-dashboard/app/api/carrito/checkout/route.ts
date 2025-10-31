import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idUsuario } = await request.json()

    if (!idUsuario) {
      return NextResponse.json({ error: "Falta el ID de usuario" }, { status: 400 })
    }

    // Mock: simular checkout exitoso
    return NextResponse.json({
      mensaje: "Compra realizada con éxito",
      total: 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error en checkout" }, { status: 500 })
  }
}
