'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { getUserOrdersById, getOrderItemByOrderId } from './actions'
import Link from 'next/link'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
} from '@tremor/react'


const OrdersPage = ({ userId, className }) => {
	const [orders, setOrders] = useState([])
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		if (!isPending) {
			startTransition(async () => {
				const dataOrders = await getUserOrdersById(userId)

				dataOrders.map(async (data) => {
					data.orderItems = await getOrderItemByOrderId(data.id)
				})

				setOrders(dataOrders)
			})
		}
	}, [])

	return (
		<div className={`${className} container mx-auto mt-10`}>
			<h1 className="text-2xl font-bold mb-5">Seus Pedidos</h1>
			<Table className="table-auto w-full">
				<TableHead className="bg-gray-200">
					<TableRow>
						<TableHeaderCell className="text-center">ID</TableHeaderCell>
						<TableHeaderCell className="text-center">
							Data
						</TableHeaderCell>
						<TableHeaderCell className="text-center">
							Total
						</TableHeaderCell>
						<TableHeaderCell className="text-center">
							Status
						</TableHeaderCell>
						<TableHeaderCell className="text-center">
							Ação
						</TableHeaderCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id}>
							<TableCell className="text-center">{order.id}</TableCell>
							<TableCell className="text-center">
								{new Date(order.createdAt).toLocaleDateString()}
							</TableCell>
							<TableCell className="text-center">
								{"R$ " + order.total.toFixed(2)}
							</TableCell>
							<TableCell className="text-center">
								{order.status}
							</TableCell>
							<TableCell className="text-center">
								<Link key={order.id} href={'/statusPedido/' + order.id}>
									<button className="bg-black hover:bg-gray-950 text-white font-bold py-2 px-4 rounded">
										Ver Pedido
									</button>
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default OrdersPage