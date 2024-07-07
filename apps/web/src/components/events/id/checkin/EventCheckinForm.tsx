"use client";

import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authenticatedAction } from "@/lib/safe-action";
import { userCheckinSchema } from "@/validators/userCheckin";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@/components/ui/input";
import type { Noop,RefCallBack } from "react-hook-form";
import c from "config";
import React, { useState, useEffect } from "react";
import { Star,StarHalf } from "lucide-react";

type RatingFormAttributes = {
	onChange: (...event: any[]) => void,
	onBlur: Noop,
	value: number,
	disabled?: boolean | undefined,
	name: string,
	ref: RefCallBack,
};

export default function EventCheckinForm({ eventID,userID }: { eventID: string,userID:string }) {

    const [feedbackLengthMessage,setFeedbackLengthMessage] = useState<string>(`0 / ${c.maxCheckinDescriptionLength} characters`);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const userCheckinForm = useForm<z.infer<typeof userCheckinSchema>>({
        resolver: zodResolver(userCheckinSchema),
        defaultValues:{
            feedback:"",
            rating:0
        }
    });

    const onSubmit = (values:z.infer<typeof userCheckinSchema>) => {
        console.log("Clicked!");
        console.log(values);
    };
    
    return (
		<Form {...userCheckinForm}>
			<form
				onSubmit={userCheckinForm.handleSubmit(onSubmit)}
				className="flex w-full flex-row justify-center"
			>
				<div className="w-[95%] space-y-8 2xl:w-[93%]">
					<FormField
						control={userCheckinForm.control}
						name="feedback"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-base">{"Feedback (Optional)"}</FormLabel>
								<FormControl>
									<Textarea
										{...field}
                                        className="min-h-[120px] lg:w-3/4 lg:min-h-[150px]"
                                        onChange={(e) => {
                                            setFeedbackMessage(e.target.value);
                                            setFeedbackLengthMessage(`${e.target.value.length} / ${c.maxCheckinDescriptionLength} characters`);
                                            field.onChange(e);
                                        }}
									/>
								</FormControl>
								<p>{feedbackLengthMessage}</p>
								<FormDescription>
									Please let us know what we can work on to
									make the event better.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={userCheckinForm.control}
						name="rating"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-base">{"Rating"}</FormLabel>
								<FormControl>
                                    <StarContainer {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Checkin</Button>
				</div>
			</form>
		</Form>
	);
}

const StarContainer = (formAttributes: RatingFormAttributes) => {

    const {
        onChange,
        onBlur,
        value,
        disabled,
        name,
        ref,
    } = formAttributes;

	const [rating, setRating] = useState<number>(0);
	const ratingStyle = "#FFD700";

	useEffect(() => {
		console.log("rating is:", rating);
	}, [rating]);

	return (
		<div className="flex w-full items-center justify-start space-x-2" ref={ref}>
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
				} else {
					return (
						<RatingStar
							starNumber={i + 1}
							setStarRating={setRating}
							color={ratingStyle}
							key={i}
                            onChange={onChange}
						/>
					);
				}
			})}
		</div>
	);
};

const RatingStar = ({
	starNumber,
	setStarRating,
	color,
	onChange,
}: {
	starNumber: number;
	setStarRating: React.Dispatch<React.SetStateAction<number>>;
	color?: string;
	onChange: (...event: any[]) => void;
}) => {
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
};

