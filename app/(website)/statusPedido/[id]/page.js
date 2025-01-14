"use server"

import CardConfirmacao from '@/components/statusPedido/CardConfirmacao';
import { prisma } from '@/utils/prisma';


export default async function StatusPedido({ params }) {


	const pedido = await prisma.order.findFirst({
		where: { id: parseInt(params.id) }, include: {
			user: true, address: true, order_items: {
				include: {
					product: {
						include: {
							productItem_product: true,
						}
					}
				},
			},
		},
	});



	return (
		<main>
			{
				<CardConfirmacao pedido={pedido}></CardConfirmacao>
			}
		</main>)
}
