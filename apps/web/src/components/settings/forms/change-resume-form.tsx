"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { editResumeFormSchema } from "@/validators/settings";
import { editResumeUrl } from "@/actions/settings/edit";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { FileInput } from "@/components/settings/patterns/file-input";
import { Button } from "@/components/ui/button";
import c, { bucketBaseUrl } from "config";
import { upload } from "@vercel/blob/client";
import { cn, formatBlobUrl } from "@/lib/utils";

interface ChangeResumeFormProps {
	resume?: string;
}

export function ChangeResumeForm({ resume }: ChangeResumeFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [resumeShown, setResumeShown] = useState(false);

	const form = useForm<z.infer<typeof editResumeFormSchema>>({
		resolver: zodResolver(editResumeFormSchema),
		defaultValues: {
			resume: undefined,
		},
	});

	const { execute } = useAction(editResumeUrl, {
		onSettled: () => setSubmitting(false),
		onSuccess: () => {
			toast.success("Account settings updated successfully");
			form.reset({ resume: undefined });
		},
		onError: (error) => {
			toast.error("Failed to update name");
			console.error(error);
		},
	});

	const onSubmit = async (data: z.infer<typeof editResumeFormSchema>) => {
		if (data.resume) {
			setSubmitting(true);

			if (data.resume.size > c.maxResumeSizeInBytes) {
				toast.error("Resume size is too large");
				return;
			}

			try {
				const uploadResult = await upload(
					`${bucketBaseUrl}/${data.resume.name}`,
					data.resume,
					{
						access: "public",
						handleUploadUrl: "/api/upload/resume",
					},
				);

				if (!uploadResult) {
					toast.error("Failed to upload resume");
					return;
				}

				execute({ resume: uploadResult.url, oldResume: resume });
			} catch (e) {
				toast.error("Failed to upload resume");
				console.error(e);
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="resume"
					render={() => (
						<FormItem className="space-y-6">
							<FormLabel className="text-lg">Resume</FormLabel>
							<Button
								variant="ghost"
								onClick={() => setResumeShown(!resumeShown)}
								className="hidden h-0 cursor-pointer p-0 px-2 text-muted-foreground underline hover:bg-background lg:inline"
							>
								{resumeShown ? "hide" : "show"}
							</Button>
							<iframe
								src={`https://docs.google.com/gview?url=${resume}&embedded=true`}
								className={cn(
									"h-[430px] w-[315px] lg:h-[560px] lg:w-[400px]",
									(!resume || !resumeShown) && "hidden",
								)}
							/>
							<FormControl>
								<FileInput
									showCurrent
									currentFileName={
										resume
											? formatBlobUrl(resume)
											: undefined
									}
									currentLink={resume}
									fileValue={
										form.getValues("resume") ?? undefined
									}
									accept={c.acceptedResumeMimeTypes.toLocaleString()}
									onChange={(file) =>
										form.setValue("resume", file, {
											shouldDirty:
												file?.name !==
												(resume &&
													formatBlobUrl(resume)),
										})
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					disabled={!form.formState.isDirty || submitting}
					className="text-md mt-4 h-8 w-full font-semibold lg:w-32"
				>
					{submitting ? (
						<LoaderCircle className="h-5 w-5 animate-spin" />
					) : (
						"Update"
					)}
				</Button>
			</form>
		</Form>
	);
}
