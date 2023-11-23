"use server";

import { prisma } from "@/utils/prisma"
import { redirect } from 'next/navigation'

export async function createOrder({ user, billing_address, shipping_same_as_billing, shipping_address, gateway, cart, total }) {
    const ids = [], orderItems = []

    cart.forEach(cartItem => {
        ids.push(cartItem.item.sku)
    })

    const items = await prisma.productItem.findMany({
        where: {
            sku: {
                in: ids
            }
        }
    })

    const updates = []

    // TODO se uma próxima compra chegar enquanto essa executa, ou seja enquanto essa execução espera o prisma retornar o valor, vai terminar vendendo itens que não tem em estoque o suficiente

    let found
    for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        found = false
        for (let k = 0; k < items.length; k++) {
            const productItem = items[k];
            if (cartItem.item.sku == productItem.sku && cartItem.item.price == productItem.price) {
                found = true
                if (cartItem.quantity > productItem.amount)
                    return { error: `Quantidade de ${cartItem.product.name} indisponível para venda. Temos ${productItem.amount} em estoque mas tentou-se comprar ${cartItem.quantity}` }
                // Nem tente criar um Pedido caso tenham tentado alterar o preço
                orderItems.push({
                    price: productItem.price,
                    sku: productItem.sku,
                    quantity: cartItem.quantity
                })
                updates.push([productItem.sku, productItem.amount - cartItem.quantity])

            }

        }
        if (!found)
            return { error: "Produto não bate com a base de dados" }
    }

    // TODO Precisa de validação ?

    const addresses = []

    addresses.push({
        street: billing_address.street,
        city: billing_address.city,
        complement: billing_address.complement,
        complement2: billing_address.complement2,
        country: billing_address.country,
        neighborhood: billing_address.neighborhood,
        number: billing_address.number,
        state: billing_address.state,
        zip_code: billing_address.zip_code,
        type: "billing",
        name: billing_address.name
    })

    if (!shipping_same_as_billing) {
        addresses.push({
            street: shipping_address.street,
            city: shipping_address.city,
            complement: shipping_address.complement,
            complement2: shipping_address.complement2,
            country: shipping_address.country,
            neighborhood: shipping_address.neighborhood,
            number: shipping_address.number,
            state: shipping_address.state,
            zip_code: shipping_address.zip_code,
            type: "shipping",
            name: shipping_address.name
        })
    }

    const transactions = []
    transactions.push(prisma.Order.create({
        data: {
            total: total,
            status: "payment-pending",
            address: {
                createMany: {
                    data: addresses,
                }
            },
            user: {
                connect: { id: user }
            },
            order_items: {
                createMany: { data: orderItems }
            }
        }
    }))
    transactions.push(updateMulti("ProductItem", ["amount"], updates, "sku"))

    const buyer = await prisma.user.findFirst({
        where: {
            id: user
        }
    })
    if (buyer && !buyer.name) {
        transactions.push(prisma.user.update({
            where: {
                id: buyer.id
            },
            data: {
                name: billing_address.name
            }
        }))
    }

    const [order] = await prisma.$transaction(transactions)

    const items2 = await prisma.productItem.findMany({
        where: {
            sku: {
                in: ids
            }
        }
    })

    return { order: order }

}

export async function GetAddressesFromUserId(user) {
    return await prisma.address.findMany({
        where: {
            users_id: {
                equals: user
            }
        }
    })
}

export async function redirectToStatusPage(id) {
    redirect(`/statusPedido/${id}`)

}

function updateMulti(tableName, fields, values, id) {
    const setSql = fields
        .map((field) => `"${field}" = "t"."${field}"`)
        .join(", ");
    const fieldsSql = fields.map((f) => `"${f}"`).join(", ");

    let paramIndex = 0;
    const valuesSql = values
        .map((row) => `(${row.map(() => `\$${++paramIndex}`)})`)
        .join(",");

    const sql = `UPDATE "${tableName}" SET ${setSql} FROM (VALUES ${valuesSql}) AS t("${id}", ${fieldsSql}) WHERE "${tableName}"."${id}" = "t"."${id}"`;

    return prisma.$executeRawUnsafe(sql, ...values.flat());
}