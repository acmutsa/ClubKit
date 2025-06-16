"use client"
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowUpCircle, CircleArrowUp, ImageUp } from "lucide-react";
import { useState } from "react";
import { createThumbnailSchema } from "db/zod";
import z from "zod";
import c, {staticUploads} from "config";
import { getSizeInMB } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {put} from "@/lib/client/file-upload"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createThumbnailAction } from "@/actions/thumbnails";
import { useAction } from "next-safe-action/hooks";



type CreateThumbnailForm = z.infer<typeof createThumbnailSchema>;


export function CreateThumbnailDialog() {

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const maxSizeInMB = getSizeInMB(c.thumbnails.maxSizeInBytes);

  const form = useForm<CreateThumbnailForm>({
    defaultValues: {
      name: "",
      url: "",
    },
    resolver: zodResolver(createThumbnailSchema),
  })

  const {execute:runCreateThumbnail} = useAction(createThumbnailAction,{
    onSuccess: () => {
      toast.success("Thumbnail created successfully");
      setIsLoading(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("An error occurred while creating the thumbnail");
      setIsLoading(false);
    },
    onSettled:() => {
      toast.dismiss()
    }
  })

  function validateAndSetThumbnail(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) {
			setThumbnail(null);
			return false;
		}
		console.log(file.size);
		if (file.size > c.thumbnails.maxSizeInBytes) {
			form.setError("url", {
				message: `Thumbnail size exceeds ${maxSizeInMB} MB`,
			});
			setThumbnail(null);
			return false;
		} else {
			form.clearErrors("url");
		}
		if (!c.thumbnails.acceptedFiles.includes(file.type as any)) {
			form.setError("url", {
				message:
					"Invalid image format. Only jpeg, png, gif, webp, svg+xml, bmp.",
			});
			setThumbnail(null);
			return false;
		}
		setThumbnail(file);
		return true;
  }

  async function onSubmit(values: CreateThumbnailForm) {
    if (!thumbnail){
      return form.setError("url",{
        message: "Please select a thumbnail to upload"
      })
    }
		setIsLoading(true);
		let url: string = c.thumbnails.default;
			url = await put(
				staticUploads.bucketCategoryThumbnailBaseUrl,
				thumbnail,
				{
					presignHandlerUrl: "/api/upload/thumbnail",
				},
			);
		runCreateThumbnail({
			...values,
			url,
		});
	}

	return (
		<Dialog>
			<form>
				<DialogTrigger asChild>
					<Button className="flex flex-nowrap gap-x-2">
						<ImageUp />
						Add Thumbnail
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add Thumbnail</DialogTitle>
						<DialogDescription>
							Please provide a name and a file to create a new
							thumbnail.
						</DialogDescription>
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
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
                    <FormLabel>Resume</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="file"
												accept={`${c.thumbnails.acceptedFiles.join(
													",",
												)}`}
												onChange={(event) => {
													const success =
														validateAndSetThumbnail(
															event,
														);
													console.log(
														event.target.value,
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
							<div className="flex w-full flex-row items-center justify-end gap-x-3">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? (
										<ArrowUpCircle className="animate-pulse" />
									) : (
										<ArrowUpCircle />
									)}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</form>
		</Dialog>
	);
}

