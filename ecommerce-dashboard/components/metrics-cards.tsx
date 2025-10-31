import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"
import type { Pedido, Producto } from "@/lib/api"

interface MetricsCardsProps {
  pedidos: Pedido[]
  productos: Producto[]
}

export function MetricsCards({ pedidos, productos }: MetricsCardsProps) {
  const ingresosTotales = pedidos.reduce((suma, p) => suma + Number.parseFloat(p.total.toString()), 0)
  const totalPedidos = pedidos.length
  const productosVendidos = pedidos.reduce((suma, p) => suma + p.cantidad, 0)
  const inventarioTotal = productos.reduce((suma, p) => suma + p.inventario, 0)

  const metricas = [
    {
      titulo: "Ingresos Totales",
      valor: `$${ingresosTotales.toFixed(2)}`,
      icono: DollarSign,
    },
    {
      titulo: "Pedidos",
      valor: totalPedidos.toString(),
      icono: ShoppingCart,
    },
    {
      titulo: "Productos Vendidos",
      valor: productosVendidos.toString(),
      icono: Package,
    },
    {
      titulo: "Inventario Total",
      valor: inventarioTotal.toString(),
      icono: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricas.map((metrica) => (
        <Card key={metrica.titulo} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metrica.titulo}</CardTitle>
            <metrica.icono className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrica.valor}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}