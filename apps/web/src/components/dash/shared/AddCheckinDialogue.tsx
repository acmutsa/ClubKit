"use client";

import { DialogHeader } from "@/components/ui/dialog";
import {
	Dialog,
	DialogTrigger,
	DialogTitle,
	DialogContent,
} from "@/components/ui/dialog";
import {
	Form,
	FormDescription,
	FormItem,
	FormField,
	FormControl,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import React, { ReactNode } from "react";
import { AdminCheckin, adminCheckinSchema } from "db/zod";
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

type Props = {
	trigger: ReactNode;
	eventList: { id: string; name: string }[];
	default?: string;
};

async function AddCheckinDialogue({ trigger, eventList }: Props) {
	const form = useForm<AdminCheckin>({
		resolver: zodResolver(adminCheckinSchema),
	});

	function onSubmit(values: AdminCheckin) {
		console.log(values);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Checkin</DialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								name="eventID"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Event</FormLabel>
										<Select {...field}>
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
														key={event.id}
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
												{...field}
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
						</form>
						<Button type="submit">Submit</Button>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

export default AddCheckinDialogue;
