"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogTrigger,
	DialogTitle,
	DialogContent,
	DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
	Form,
	FormDescription,
	FormItem,
	FormField,
	FormControl,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { CheckinResult } from "@/lib/types/events";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import React, { ReactNode } from "react";
import { AdminCheckin, adminCheckinSchema, universityIDSplitter } from "db/zod";
import { adminCheckin } from "@/actions/events/checkin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import c from "config";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
	trigger: ReactNode;
	eventList: { id: string; name: string }[];
	default?: {
		eventID?: string;
		universityIDs?: string;
	};
};

async function AddCheckinDialogue({ trigger, eventList, ...props }: Props) {
	const form = useForm<AdminCheckin>({
		resolver: zodResolver(adminCheckinSchema),
		defaultValues: {
			eventID: props.default?.eventID || eventList[0].id,
			universityIDs: props.default?.universityIDs || "",
		},
	});

	const {
		execute: runAddCheckin,
		status: actionStatus,
		result: actionResult,
		reset: resetAction,
	} = useAction(adminCheckin, {
		onSuccess: async ({ success, code, failedIDs }) => {
			toast.dismiss();
			if (!success) {
				switch (code) {
					case CheckinResult.FAILED:
						toast.error("All checkins failed.");
						break;
					case CheckinResult.SOME_FAILED:
						toast.warning(
							`The following checkins failed: ${failedIDs.join()}`,
						);
						break;
					default:
						toast.error(
							`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
						);
						break;
				}
				return;
			}
			toast.success("Checkins Successfully Added!");
			resetAction();
		},
		onError: async (error) => {
			toast.dismiss();
			toast.error(
				`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
			);
			console.log("error: ", error);
			resetAction();
		},
	});

	async function onSubmit(data: AdminCheckin, evt: any) {
		evt.preventDefault();
		toast.loading("Creating Checkins...");
		runAddCheckin(data);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Checkin</DialogTitle>
					<Form {...form}>
						<form
							className="space-y-6"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								name="eventID"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Event</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue
														placeholder={
															"Select an Event"
														}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{eventList.map((event) => (
													<SelectItem
														value={event.id}
													>
														{event.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="universityIDs"
								render={({ field }) => (
									<FormItem>
										<FormLabel>University ID(s)</FormLabel>
										<FormControl>
											<Textarea
												onChange={field.onChange}
												defaultValue={field.value}
												placeholder="abc123, jkm456, xyz789"
											/>
										</FormControl>
										<FormDescription>
											Please enter the university ID(s)
											(comma separated) of the event you
											would like to add checkins to.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={
									actionStatus == "executing" ||
									(actionStatus == "hasSucceeded" &&
										actionResult.data?.success)
								}
							>
								Submit
							</Button>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

export default AddCheckinDialogue;
