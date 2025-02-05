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
import { useState, useCallback } from "react";
import { editResumeFormSchema } from "@/validators/settings";
import { editResumeUrl } from "@/actions/settings/edit";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { FileInput } from "@/components/shared/file-input";
import { Button } from "@/components/ui/button";
import c, { bucketBaseUrl } from "config";
import { upload } from "@vercel/blob/client";
import { formatBlobUrl } from "@/lib/utils";

interface ChangeResumeFormProps {
	resume?: string;
}

export function ChangeResumeForm({ resume }: ChangeResumeFormProps) {
	const [submitting, setSubmitting] = useState(false);

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

	const onSubmit = useCallback(
		async (data: z.infer<typeof editResumeFormSchema>) => {
			setSubmitting(true);
			if (!form.formState.isDirty) {
				setSubmitting(false);
				toast.error("No changes detected!", {
					description:
						"Try making some changes to your resume before submitting",
					classNames: { title: "font-bold text-md" },
				});
				return;
			}

			if (data.resume) {
				if (data.resume.size > c.maxResumeSizeInBytes) {
					toast.error("Resume size is too large");
					return;
				}

				try {
					const uploadResult = await upload(
						`${bucketBaseUrl}/resume/${data.resume.name}`,
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
			} else if (data.resume === null) {
				execute({ resume: "", oldResume: resume });
			} else {
				setSubmitting(false);
			}
		},
		[form.formState.isDirty, execute],
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="resume"
					render={() => (
						<FormItem className="space-y-3">
							<FormLabel className="text-lg">Resume</FormLabel>
							<FormControl>
								<FileInput
									onRemove={() => {
										form.setValue("resume", null, {
											shouldDirty: true,
										});
									}}
									showCurrent
									currentFileName={
										resume
											? formatBlobUrl(resume)
											: undefined
									}
									currentLink={resume}
									fileValue={form.getValues("resume")}
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
					disabled={submitting}
					className="text-md mt-4 w-full font-semibold lg:w-32"
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
