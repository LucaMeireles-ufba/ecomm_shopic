import { theme } from '@/utils/tailwind'
import { Star, StarHalf } from 'lucide-react'

/***
 * @param {Object} param0
 * @param {float} param0.rating
 * @param {boolean=} param0.hideNumber
 */
// ... (imports and other code)

export default function RenderStars({ rating, hideNumber }) {
	const stars = [];
	let i = parseInt(rating.toFixed(0));
  
	while (i > 0) {
	  if (i >= 1)
		stars.push(
		  <Star
			key={`full-star-${i}`}
			fill={theme.colors.yellow[300]}
			stroke={theme.colors.yellow[400]}
		  ></Star>
		);
	  else
		stars.push(
		  <StarHalf
			key={`half-star-${i}`}
			fill={theme.colors.yellow[300]}
			stroke={theme.colors.yellow[400]}
		  ></StarHalf>
		);
	  i--;
	}
	while (stars.length < 5) {
	  stars.push(
		<Star key={`empty-star-${stars.length}`} stroke={theme.colors.yellow[400]}></Star>
	  );
	}
  
	return (
	  <div className="flex flex-row">
		{stars}
		{!hideNumber && <span className="ml-1">{rating.toFixed(0)}/5</span>}
	  </div>
	);
}
  