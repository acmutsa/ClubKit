"use client";

import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { updateEventCategory } from "@/actions/categories";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@/components/ui/input";
import { SetStateAction, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { eventCategorySchema } from "db/zod";
import { Loader2 } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type EditCategoryProps = {
	eventCategory: z.infer<typeof eventCategorySchema>;
	setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function EditCategoryDialogue(
	editCategoryProps: EditCategoryProps,
) {
	const { eventCategory: inputProps, setOpen } = editCategoryProps;
	const form = useForm<z.infer<typeof eventCategorySchema>>({
		resolver: zodResolver(eventCategorySchema),
		defaultValues: {
			...inputProps,
		},
	});

	const { execute: runUpdateEventCategory, status } = useAction(
		updateEventCategory,
		{
			onSuccess: ({ data }) => {
				toast.dismiss();
				if (data?.message == "category_exists") {
					return toast.error(
						`Event category ${form.getValues("name")} already exists`,
					);
				}
				setOpen(false);
				toast.success("Event category created successfully");
			},
			onError: (e) => {
				toast.dismiss();
				toast.error(`Failed to update ${form.getValues("name")}`);
			},
		},
	);
	const isLoading = status === "executing";
	return (
		<>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Event Category</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(runUpdateEventCategory)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter Name"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category Color</FormLabel>
									<FormControl>
										<div className="flex flex-col space-y-4 rounded-lg border border-muted p-4">
											<HexColorPicker
												color={field.value}
												onChange={(color) =>
													form.setValue(
														"color",
														color,
													)
												}
												style={{
													height: "7rem",
													width: "100%",
												}}
											/>
											<Input
												{...field}
												className="rounded-lg"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={isLoading}
								className="flex justify-end"
							>
								{isLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Update"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</>
	);
}
