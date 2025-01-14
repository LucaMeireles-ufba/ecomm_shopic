import OrdersTable from "./components/ordersTable";
import { prisma } from "@/utils/prisma";

export default async function Dashboard() {
    const orders = await prisma.order.findMany({
        select: {
            id: true,
            status: true,
            total: true,
            user: {
                select: {
                    name: true,
                    email: true,
                }
            },
            order_items: {
                include: {
                    product: {
                        include: {
                            productItem_product: true,
                        }
                    }
                }
            },
            createdAt: true
        }
    });

    return (
        <OrdersTable orders={orders} />
    )
}
