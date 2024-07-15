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
import { Toaster } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userCheckinFormSchema } from "@/validators/userCheckin";
import { useAction } from "next-safe-action/hooks";
import type { Noop,RefCallBack } from "react-hook-form";
import c from "config";
import React, { useState, useEffect } from "react";
import { Star, X,Check } from "lucide-react";
import { toast } from "sonner";
import { checkInUser } from "@/actions/events/checkin";
import { useRouter } from "next/navigation";
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
    const userCheckinForm = useForm<z.infer<typeof userCheckinFormSchema>>({
        resolver: zodResolver(userCheckinFormSchema),
        defaultValues:{
            feedback:"",
            rating:0
        }
    });

    const { push } = useRouter();

    const {
        execute:runCheckInUser,
        status:checkInUserStatus,
        result:checkInUserResult,
        reset:resetCheckInUser
    } = useAction(checkInUser,{
        onSuccess: async ({success,code})=>{
            toast.dismiss();
            toast.success("Thanks for stopping by. See you next time!", {
				duration: Infinity,
				description: "Redirecting to events page in 3 seconds...",
            //     action:{
            //         label:"Or click here",
            //         onClick:()=>{
            //             push("/events");
            //     }
            // }
        });

            // setTimeout(() => {
            //     push("/events");
            // }, 3000);
        },
        onError:async (e)=>{
            toast.dismiss();
            if (e.validationErrors){
                toast.error(`Please check your input. ${e.validationErrors}`, {
					duration:Infinity,
                    cancel:{
                        label:"Dismiss",
                        onClick:()=>{
                            console.log("dismissed")
                    }},
				});
            }
            else{
            toast.error(`Something went wrong checking in user.`,{
                duration:Infinity,
                    cancel:{
                        label:"Close",
                        // cancel object requires an onclick so a blank one is passed
                        onClick:()=>{}
                }
            });
            }
        }
    }
    )

    const onSubmit = async (checkInValues:z.infer<typeof userCheckinFormSchema>) => {
        toast.dismiss();
        resetCheckInUser();
        
        toast.loading("Checking in...");
        runCheckInUser({
            feedback:checkInValues.feedback,
            rating:checkInValues.rating,
            userId:userID,
            eventId:eventID
        });
    };

    const isSuccess = checkInUserStatus === "hasSucceeded" && checkInUserResult.data?.success;
    const isError = checkInUserStatus === "hasErrored";
    

    return (
		<>
			<Form {...userCheckinForm}>
				<form
					onSubmit={userCheckinForm.handleSubmit(onSubmit)}
					className="flex h-full w-full flex-row justify-center"
				>
					<div className="flex flex-col items-start space-y-8 w-3/4">
						<FormField
							control={userCheckinForm.control}
							name="feedback"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="text-base">
										{"Feedback (Optional)"}
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											className="min-h-[120px] lg:min-h-[150px] lg:w-full"
											onChange={(e) => {
												setFeedbackLengthMessage(
													`${e.target.value.length} / ${c.maxCheckinDescriptionLength} characters`,
												);
												field.onChange(e);
											}}
										/>
									</FormControl>
									<p>{feedbackLengthMessage}</p>
									<FormDescription>
										Please let us know what we can work on
										to make the event better.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={userCheckinForm.control}
							name="rating"
							render={({ field }) => (
								<FormItem className="flex w-full flex-col items-center">
									<FormLabel className="flex w-full items-center justify-start text-base">
										{"Rating"}
									</FormLabel>
									<FormControl>
										<StarContainer {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="w-full flex flex-row items-center justify-center gap-4 pt-4">
							<Button
								type="submit"
								disabled={
									checkInUserStatus == "executing" ||
									(checkInUserStatus == "hasSucceeded" &&
										checkInUserResult.data?.success)
								}
							>
								Check In
							</Button>
							{isSuccess ? (
								<Check size={32} color="green" />
							) : isError ? (
								<X size={32} color="red" />
							) : null}
						</div>
					</div>
				</form>
			</Form>
			<Toaster position="bottom-right" richColors />
		</>
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

