'use server'

import { prisma } from '@/utils/prisma'
import { getServerSession } from '@/app/api/auth/[...nextauth]/route'

async function queryAllOrders() {
    const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }
    const data = await prisma.order.findMany({
        select: {
            id: true,
            users_id: true,
            status: true,
            total: true
        }
    });

    return data;
}

export { queryAllOrders }