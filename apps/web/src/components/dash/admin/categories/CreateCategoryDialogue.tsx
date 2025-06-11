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
import c, { staticUploads } from "config";
import { put } from "@/lib/client/file-upload";
import { getSizeInMB } from "@/lib/utils";

type CreateCategoryForm = z.infer<typeof createEventCategorySchema>;

export default function CreateCategoryDialogue() {
	const [open, setOpen] = useState(false);
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<CreateCategoryForm>({
		resolver: zodResolver(createEventCategorySchema),
		defaultValues: {
			color: "#000000",
			name: "",
		},
	});

	const maxSizeInMB = getSizeInMB(c.thumbnails.maxSizeInBytes);

	function validateAndSetThumbnail(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		if (!file) {
			setThumbnail(null);
			return false;
		}
		console.log(file.size);
		if (file.size > c.thumbnails.maxSizeInBytes) {
			form.setError("thumbnailUrl", {
				message: `Thumbnail size exceeds ${maxSizeInMB} MB`,
			});
			setThumbnail(null);
			return false;
		} else {
			form.clearErrors("thumbnailUrl");
		}
		if (!c.thumbnails.acceptedFiles.includes(file.type as any)) {
			form.setError("thumbnailUrl", {
				message:
					"Invalid image format. Only jpeg, png, gif, webp, svg+xml, bmp.",
			});
			setThumbnail(null);
			return false;
		}
		setThumbnail(file);
		return true;
	}

	const { refresh } = useRouter();
	const { execute: runCreateEventCategory } = useAction(createEventCategory, {
		onSuccess: ({ data }) => {
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
			console.error(e);
			toast.error("Failed to create event category");
		},
		onSettled: () => {
			setIsLoading(false);
			toast.dismiss();
		},
	});

	async function onSubmit(values: CreateCategoryForm) {
		setIsLoading(true);
		let thumbnailUrl: string = c.thumbnails.default;
		if (thumbnail) {
			thumbnailUrl = await put(
				staticUploads.bucketCategoryThumbnailBaseUrl,
				thumbnail,
				{
					presignHandlerUrl: "/api/upload/thumbnail",
				},
			);
		}
		runCreateEventCategory({
			...values,
			thumbnailUrl,
		});
	}

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
						onSubmit={form.handleSubmit(onSubmit)}
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
							name="thumbnailUrl"
							render={({
								field: { value, onChange, ...fieldProps },
							}) => (
								<FormItem>
									<FormLabel>Default Thumbnail</FormLabel>
									<FormControl>
										<Input
											{...fieldProps}
											type="file"
											accept={`${c.thumbnails.acceptedFiles.join(
												",",
											)}`}
											onChange={(event) => {
												const success =
													validateAndSetThumbnail(
														event,
													);
												if (!success) {
													event.target.value = "";
												}
											}}
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
