'use server'

import { getServerSession } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/utils/prisma'
import { revalidatePath } from 'next/cache';

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

async function updateStatus(orderId, orderStatus) {
    const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }
    await prisma.order.update({
        where: {
            id: parseInt(orderId)
        },
        data: {
            status: orderStatus,
        },
    });

    revalidatePath('/admin/')
}

export { queryAllOrders, updateStatus }