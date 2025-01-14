'use client'

import { CartItem } from '@/components/ui/cartItem'
import { useCart } from '@/components/CartContext'
import Link from 'next/link'

export default function Cart() {
	const { cartItems, cartTotal } = useCart()

	return (
		<div className="max-w-7xl w-full pt-5 pb-8 px-8 grid grid-cols-5 gap-8">
			<h1 className="mb-2 text-4xl font-black col-span-5">Carrinho</h1>
			{cartItems.length === 0 ? (
				<h2>Seu carrinho está vazio</h2>
			) : (
				<>
					<div className="grid [grid-template-columns:subgrid] col-span-5">
						<div className="text-sm text-center font-bold border-b pb-2">
							Imagem
						</div>
						<div className="text-sm text-center font-bold border-b pb-2">
							Nome do Produto
						</div>
						<div className="text-sm text-center font-bold border-b pb-2">
							Quantidade
						</div>
						<div className="text-sm text-center font-bold border-b pb-2">
							Preço
						</div>
						<div className="text-sm text-center font-bold border-b pb-2">
							Subtotal
						</div>
					</div>
					<div className="grid [grid-template-columns:subgrid] col-span-5 gap-5 my-5">
						{cartItems.map((item) => (
							<CartItem key={item.item.sku} item={item} />
						))}
					</div>

					<span className="col-span-3"></span>
					<div className="grid [grid-template-columns:subgrid] text-center col-span-2 bg-zinc-50 p-5">
						<span className="">Total:</span>
						<span>R${cartTotal.toFixed(2)}</span>
					</div>
					<span className="col-span-3"></span>
					<div className="[margin-top:-2rem] col-span-2 bg-zinc-50 p-5">
						<Link href="/checkout" className="col-span-2">
							<button className="bg-black text-white border-2 border-black hover:bg-transparent hover:text-black duration-300 w-full rounded-full py-2 px-4">
								Finalizar compra
							</button>
						</Link>
					</div>
				</>
			)}
		</div>
	)
}

