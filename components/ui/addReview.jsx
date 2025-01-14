'use client'

import { useState } from 'react'
import ClickableStars from './clickableStars'
import { processReview } from '@/app/(website)/product/reviews'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

export default function AddReview({ productId }) {
	const FORM_NAME = 'addReview'

	async function onProcessReview(formData) {
		const res = await processReview(formData)
		if (res && res.message) toast.error(res.message)
	}

	const { session, status } = useSession();

	function FloatLabel({ name, type, label, initialValue = '', ...rest }) {
		const [isActive, setIsActive] = useState(false)
		const [value, setValue] = useState(initialValue)

		function handleTextChange(text) {
			setValue(text)

			if (text !== '') {
				setIsActive(true)
			} else {
				setIsActive(false)
			}
		}

		return (
			<div id="float-label" {...rest}>
				<label className="hidden invisible" htmlFor={name}>
					{label}
				</label>
				<input
					form={FORM_NAME}
					type={type}
					value={value}
					id={name}
					name={name}
					placeholder={label}
					onChange={(e) => handleTextChange(e.target.value)}
					className="w-full p-4 outline-0 border border-solid border-zinc-300 rounded"
				/>
			</div>
		)
	}

	if (status == "unauthenticated")
		return null

	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-bold text-2xl">Nos envie a sua avaliação!</h2>
			<form
				id={FORM_NAME}
				className="flex flex-col w-full gap-4 border p-4 rounded-lg"
				action={onProcessReview}
			>
				<div className="flex flex-col gap-2 col-span-1">
					<label>Nota que deseja atribuir:</label>
					<ClickableStars form={FORM_NAME} name="rating"></ClickableStars>
				</div>
				<FloatLabel
					name="title"
					type="text"
					label="Título da avaliação"
					className="col-span-3"
				></FloatLabel>
				<textarea
					placeholder="Descreva sua experiência"
					className="w-full p-2 border-zinc-300 rounded border border-solid"
					id="text"
					name="text"
				></textarea>

				<input type="hidden" name="productId" value={productId}></input>
				<button
					type="submit"
					className="border-2 border-black p-2 bg-black text-white rounded-full hover:bg-transparent hover:text-black duration-300"
					disabled={status == "unauthenticated"}
				>
					Avaliar
				</button>
			</form>
		</section>
	)
}
