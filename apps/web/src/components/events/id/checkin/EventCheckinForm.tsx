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
import { userCheckinSchemaFormified } from "db/zod";
import { useAction } from "next-safe-action/hooks";
import c from "config";
import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import { checkInUserAction } from "@/actions/events/checkin";
import { useRouter } from "next/navigation";
import type { CheckInUserClientProps } from "db/types";
import RatingStars from "./RatingStars";

export default function EventCheckinForm({
	eventID,
	userID,
}: {
	eventID: string;
	userID: number;
}) {
	const maxCheckinDescriptionLength = c.maxCheckinDescriptionLength;
	const [feedbackLengthMessage, setFeedbackLengthMessage] = useState<string>(
		`0 / ${maxCheckinDescriptionLength} characters`,
	);
	const userCheckinForm = useForm<z.infer<typeof userCheckinSchemaFormified>>({
		resolver: zodResolver(userCheckinSchemaFormified),
		defaultValues: {
			feedback: "",
			rating: 0,
			eventID,
			userID,
		},
	});

	const { push } = useRouter();

	const {
		execute: runCheckInUser,
		status: checkInUserStatus,
		result: checkInUserResult,
		reset: resetCheckInUser,
	} = useAction(checkInUserAction, {
		onSuccess: async ({data}) => {
			toast.dismiss();
			const success = data?.success;
			const code = data?.code;
			if (!success) {
				toast.error(code, {
					duration: Infinity,
					cancel: {
						label: "Close",
						// cancel object requires an onclick so a blank one is passed
						onClick: () => {},
					},
				});
				return;
			}
			toast.success("Thanks for stopping by. See you next time!", {
				duration: Infinity,
				description: "Redirecting to events page...",
			});
			setTimeout(() => {
				push("/dash");
			}, 2500);
		},
		onError: async ({error:e}) => {
			toast.dismiss();
			if (e.validationErrors) {
				toast.error(`Please check your input. ${e.validationErrors}`, {
					duration: Infinity,
					cancel: {
						label: "Dismiss",
						onClick: () => {},
					},
				});
			} else {
				console.log(e.serverError)
				toast.error(`Something went wrong checking in user.`, {
					duration: Infinity,
					cancel: {
						label: "Close",
						// cancel object requires an onclick so a blank one is passed
						onClick: () => {},
					},
				});
			}
		},
	});

	const onSubmit = async (
		checkInValues: CheckInUserClientProps,
	) => {
		toast.dismiss();
		resetCheckInUser();

		toast.loading("Checking in...");
		runCheckInUser({
			...checkInValues,
			userID,
			eventID,
		});
	};

	const isSuccess =
		checkInUserStatus === "hasSucceeded" && checkInUserResult.data?.success;
	const isError = checkInUserStatus === "hasErrored";
	useEffect(() => {
		console.log(userCheckinForm.formState.errors);
	}
	, [userCheckinForm.formState.errors]);
	return (
		<>
			<Form {...userCheckinForm}>
				<form
					onSubmit={userCheckinForm.handleSubmit(onSubmit)}
					className="mx-5 flex h-full flex-row sm:mx-0 sm:justify-center"
				>
					<div className="flex w-full flex-col items-start justify-start 2xl:justify-center space-y-12 sm:w-3/4">
						<FormField
							control={userCheckinForm.control}
							name="rating"
							render={({ field }) => (
								<FormItem className="flex w-full flex-col items-center">
									<FormLabel className="flex w-full items-center justify-start text-base">
										{"Rating"}
									</FormLabel>
									<FormControl>
										<RatingStars {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={userCheckinForm.control}
							name="feedback"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="text-base">
										{"Feedback (Optional)"}
									</FormLabel>
									<FormDescription>
										Please let us know what we can work on
										to make the event better.
									</FormDescription>
									<FormControl>
										<Textarea
											{...field}
											className="monitor:min-h-[300px] min-h-[120px] text-base lg:min-h-[150px] lg:w-full lg:text-lg xl:min-h-[200px] 2xl:min-h-[250px]"
											maxLength={
												maxCheckinDescriptionLength
											}
											onChange={(e) => {
												setFeedbackLengthMessage(
													`${e.target.value.length} / ${maxCheckinDescriptionLength} characters`,
												);
												field.onChange(e);
											}}
										/>
									</FormControl>
									<p>{feedbackLengthMessage}</p>

									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex w-full flex-row items-center justify-center gap-4 pt-4">
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




