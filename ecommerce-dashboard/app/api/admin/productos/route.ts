import { NextResponse } from "next/server"
import { agregarProducto } from "@/lib/mock-data"

export async function POST(request: Request) {
  try {
    const { nombre, precio, inventario } = await request.json()

    if (!nombre || !precio || inventario === undefined) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const nuevoProducto = agregarProducto(nombre, precio, inventario)
    return NextResponse.json(nuevoProducto)
  } catch (error) {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
