import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Pedido } from "@/lib/api"

interface RecentOrdersProps {
  pedidos: Pedido[]
}

export function RecentOrders({ pedidos }: RecentOrdersProps) {
  const recentOrders = pedidos.slice(-5).reverse()

  const getStatusBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pagado":
        return { variant: "default" as const, label: "Completado" }
      case "pendiente":
        return { variant: "secondary" as const, label: "Procesando" }
      case "enviado":
        return { variant: "outline" as const, label: "Enviado" }
      default:
        return { variant: "secondary" as const, label: estado }
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Pedidos Recientes</CardTitle>
        <CardDescription className="text-muted-foreground">Últimos pedidos realizados en tu tienda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay pedidos aún</p>
          ) : (
            recentOrders.map((order) => {
              const status = getStatusBadge(order.estado)
              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary">#{order.id}</span>
                      <Badge variant={status.variant} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground">
                      {order.Producto?.nombre || `Producto ${order.idProducto}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Cantidad: {order.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">
                      ${Number.parseFloat(order.total.toString()).toFixed(2)}
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
