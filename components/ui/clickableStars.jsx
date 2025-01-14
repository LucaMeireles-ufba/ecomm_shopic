'use client'

import { theme } from '@/utils/tailwind'
import { Star, StarHalf } from 'lucide-react'
import { useState } from 'react'

/***
 * @param {Object} param0
 * @param {float} param0.rating
 * @param {boolean=} param0.hideNumber
 */
export default function ClickableStars({ hideNumber, form = '', name = '' }) {
	const [rating, setRating] = useState(0)

	return (
		<div className="flex flex-row">
			<input form={form} type="hidden" name={name} value={rating}></input>
			{[...Array(5)].map((star, index) => {
				index += 1
				return (
					<button
						type="button"
						key={index}
						onClick={() => setRating(index)}
					>
						<Star
							stroke={theme.colors.yellow[400]}
							fill={
								index <= rating
									? theme.colors.yellow[300]
									: theme.colors.transparent
							}
						></Star>
					</button>
				)
			})}
			{!hideNumber && <span className="ml-1">{rating} / 5</span>}
		</div>
	)
}
