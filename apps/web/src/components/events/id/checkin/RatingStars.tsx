import type { RatingFormAttributes } from "@/lib/types/events";
import { useState } from "react";
import RatingStar from "./RatingStar";

export default function RatingStars(formAttributes: RatingFormAttributes) {
	const { onChange, ref } = formAttributes;

	const [rating, setRating] = useState<number>(0);
	const ratingStyle = "#FFD700";

	return (
		<div
			className="flex w-full cursor-pointer items-center justify-start space-x-2"
			ref={ref}
		>
			{Array.from({ length: 5 }, (_, i) => {
				if (i + 1 > rating) {
					return (
						<RatingStar
							starNumber={i + 1}
							setStarRating={setRating}
							key={i}
							onChange={onChange}
						/>
					);
				}
				return (
					<RatingStar
						starNumber={i + 1}
						setStarRating={setRating}
						color={ratingStyle}
						key={i}
						onChange={onChange}
					/>
				);
			})}
		</div>
	);
}
