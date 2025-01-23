import * as React from "react";
import { Star } from "lucide-react";

export default function RatingStar({
	starNumber,
	setStarRating,
	color,
	onChange,
}: {
	starNumber: number;
	setStarRating: React.Dispatch<React.SetStateAction<number>>;
	color?: string;
	onChange: (...event: any[]) => void;
}) {
	return (
		<Star
			size={32}
			onClick={() => {
				setStarRating(starNumber);
				onChange(starNumber);
			}}
			color={color}
			enableBackground={color}
		/>
	);
}
