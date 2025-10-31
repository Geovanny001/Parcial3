import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Pedido } from "@/lib/api"
import { ShoppingCart } from "lucide-react"

interface PedidosTableProps {
  pedidos: Pedido[]
}

export function PedidosTable({ pedidos }: PedidosTableProps) {
  const obtenerBadgeEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pagado":
        return { variante: "default" as const, etiqueta: "Completado" }
      case "pendiente":
        return { variante: "secondary" as const, etiqueta: "Procesando" }
      case "enviado":
        return { variante: "outline" as const, etiqueta: "Enviado" }
      default:
        return { variante: "secondary" as const, etiqueta: estado }
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Todos los Pedidos</CardTitle>
        <CardDescription className="text-muted-foreground">Lista completa de pedidos realizados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pedidos.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay pedidos aún</p>
            </div>
          ) : (
            pedidos.map((pedido) => {
              const estadoBadge = obtenerBadgeEstado(pedido.estado)
              return (
                <div
                  key={pedido.id}
                  className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary">#{pedido.id}</span>
                      <Badge variant={estadoBadge.variante} className="text-xs">
                        {estadoBadge.etiqueta}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground">
                      {pedido.Producto?.nombre || `Producto ${pedido.idProducto}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Cantidad: {pedido.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">
                      ${Number.parseFloat(pedido.total.toString()).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
