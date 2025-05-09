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

async function deleteProductItem(productItemID) {
    const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.productItem.delete({
            where: {
                id: productItemID
            }
        })
        return true
    } catch (error) {
        console.error("Error deleting product item:", error)
        return false
    }
}

export { queryProductByID, deleteProductItem }