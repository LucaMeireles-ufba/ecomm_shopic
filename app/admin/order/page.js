import { AdminTable } from "@/components/admin/adminTable";
import { prisma } from "@/utils/prisma";

export default async function ManageOrders() {
    const orders = await prisma.order.findMany({
        select: {
            id: true,
            status: true,
            total: true,
            user: {
                select: {
                    name: true
                }
            }
        }
    })

    for (let i = 0; i < orders.length; i++) {
        const element = orders[i];
        element.user = element.user.name
        element.total = "R$"+element.total.toFixed(2)
        switch(element.status) {
            case "completed": element.status = "Completado"; break
            case "shipped": element.status = "Enviado"; break
            case "payment-pending": element.status = "Pagamento Pendente"; break
            case "processing": element.status = "Processando"; break
            case "waiting": element.status = "Aguardando"; break
            case "delivered": element.status = "Entregue"; break
            case "canceled": element.status = "Cancelado"; break
            //status
        }
    }

    const actions = [
        {
            name: 'Edit',
            color: 'blue',
            dest: '/admin/order/$1'
        }
    ]

    const headers = ['Pedido', 'Status', 'Total', 'Comprador', 'Action']

    return (
        <div>
            <AdminTable
                title="Pedidos"
                headers={headers}
                data={orders}
                actions={actions}
            />
        </div>
    )
}