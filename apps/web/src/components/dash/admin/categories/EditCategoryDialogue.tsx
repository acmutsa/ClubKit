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
import { FormEvent, SetStateAction, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { editEventCategorySchema } from "db/zod";
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
import { useRouter } from "next/navigation";
import { put } from "@/lib/client/file-upload";
import { getSizeInMB } from "@/lib/utils";
import { staticUploads } from "config";
import c from "config";
import Image from "next/image";

type EditCategoryProps = {
	eventCategory: z.infer<typeof editEventCategorySchema>;
	open: boolean;
	setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function EditCategoryDialogue(
	editCategoryProps: EditCategoryProps,
) {
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [tempThumbnailUrl, setTempThumbnailUrl] = useState<string | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const { refresh } = useRouter();

	const { eventCategory: inputProps, setOpen, open } = editCategoryProps;
	const form = useForm<z.infer<typeof editEventCategorySchema>>({
		resolver: zodResolver(editEventCategorySchema),
		defaultValues: {
			...inputProps,
		},
	});

	function validateAndSetThumbnail(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		if (!file) {
			setThumbnail(null);
			return false;
		}
		if (file.size > c.thumbnails.maxSizeInBytes) {
			form.setError("thumbnailUrl", {
				message: `Thumbnail size exceeds ${maxSizeInMB} MB`,
			});
			setThumbnail(null);
			return false;
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
		setTempThumbnailUrl(URL.createObjectURL(file));
		return true;
	}

	// this is required here in order to reset the dialog as router.refresh / revalidatePath will not properly make the change
	useEffect(() => {
		if (open) {
			form.reset({
				...inputProps,
			});
		}
	}, [open]);

	const maxSizeInMB = getSizeInMB(c.thumbnails.maxSizeInBytes);

	const { execute: runUpdateEventCategory } = useAction(updateEventCategory, {
		onSuccess: ({ data }) => {
			if (data?.message == "category_exists") {
				return toast.error(
					`Event category ${form.getValues("name")} already exists`,
				);
			}
			setOpen(false);
			toast.success("Event category created successfully");
			refresh();
		},
		onError: (e) => {
			toast.error(`Failed to update ${form.getValues("name")}`);
		},
		onSettled: () => {
			setIsLoading(false);
			toast.dismiss();
		},
	});

	useEffect(() => {
		console.log("form dirty", form.formState.isDirty);
	}, [form.formState.isDirty]);

	async function onSubmit(data: z.infer<typeof editEventCategorySchema>) {
		if (!form.formState.isDirty && !thumbnail) {
			return toast.error("No changes made");
		}
		setIsLoading(true);

		if (thumbnail) {
			const thumbnailUrl = await put(
				staticUploads.bucketEventThumbnailBaseUrl,
				thumbnail,
				{
					presignHandlerUrl: "/api/upload/thumbnail",
				},
			);
			data.thumbnailUrl = thumbnailUrl;
			data.oldThumbnailUrl = inputProps.thumbnailUrl;
		}
		runUpdateEventCategory(data);
	}
	return (
		<>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Event Category</DialogTitle>
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
						<div className="flex flex-row gap-x-2">
							<p>Current: </p>
							<Image
								src={
									tempThumbnailUrl || inputProps.thumbnailUrl
								}
								alt={`Thumbnail for event ${tempThumbnailUrl}`}
								width={20}
								height={20}
							/>
						</div>
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
														{
															shouldDirty: true,
														},
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
