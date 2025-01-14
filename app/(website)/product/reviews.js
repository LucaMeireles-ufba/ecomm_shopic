"use server"

import { getServerSession } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

async function processReview(formData) {
    // TODO pegar o usuário atual
    const currentUserId = (await prisma.user.findFirst({
        where: {
            id: (await getServerSession()).user.id
        }
    })).id
    const productsId = parseInt(formData.get('productId'))
    if (await canAddReview(currentUserId, productsId)) {
        await prisma.review.create({
            data: {
                products_id: productsId,
                users_id: currentUserId,
                rating: parseInt(formData.get('rating')),
                title: formData.get('title'),
                text: formData.get('text'),
            }
        })
        return revalidatePath(`/product/${productsId}`)
    }
    return { message: 'Não autorizado! Você precisa ter comprado e recebido esse produto para fazer uma avaliação.' }
}

async function canAddReview(userId, productId) {
    return await prisma.order.findFirst({
        where: {
            users_id: userId,
            order_items: {
                some: {
                    product: {
                        product_id: productId
                    }
                }
            },
            status: {
                equals: 'completed'
            }
        }
    }) != null
}

export { processReview }