import { NextResponse } from "next/server"
import { getProductos } from "@/lib/mock-data"

export async function GET() {
  try {
    const productos = getProductos()
    return NextResponse.json(productos)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}
