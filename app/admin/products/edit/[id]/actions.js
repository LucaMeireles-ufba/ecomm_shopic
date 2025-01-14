'use server'

const { prisma } = require("@/utils/prisma")
import { getServerSession } from '@/app/api/auth/[...nextauth]/route'

async function queryProductByID(productID) {
    const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }
    return await prisma.product.findUnique({
        where: {
            id: productID
        },
        include: {
            product_item: {
                select: {
                    id: true,
                    sku: true,
                    price: true,
                    size: true,
                    color: true,
                    amount: true
                }
            }
        }
    })
}

export { queryProductByID }