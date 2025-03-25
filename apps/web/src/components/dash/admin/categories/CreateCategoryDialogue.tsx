"use client";

import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import { createEventCategory } from "@/actions/categories";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { createEventCategorySchema } from "db/zod";
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
import { Dialog } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCategoryDialogue() {
	const [open, setOpen] = useState(false);
	const form = useForm<z.infer<typeof createEventCategorySchema>>({
		resolver: zodResolver(createEventCategorySchema),
		defaultValues: {
			color: "#000000",
			name: "",
		},
	});
	const { refresh } = useRouter();
	const { execute: runCreateEventCategory, status } = useAction(
		createEventCategory,
		{
			onSuccess: ({ data }) => {
				toast.dismiss();
				if (data?.message == "category_exists") {
					return toast.error(
						`Event category ${form.getValues("name")} already exists`,
					);
				}
				form.reset();
				setOpen(false);
				toast.success("Event category created successfully");
				refresh();
			},
			onError: (e) => {
				toast.dismiss();
				toast.error("Failed to create event category");
			},
		},
	);
	const isLoading = status === "executing";
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex flex-nowrap gap-x-2">
					<Plus />
					Add Category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Event Category</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(runCreateEventCategory)}
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
									"Create"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
