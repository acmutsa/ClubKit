"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { editProfilePictureSchema } from "@/validators/settings";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FileInput } from "@/components/shared/file-input";
import { Button } from "@/components/ui/button";

interface ChangeProfilePictureFormProps {
	profilePicture?: string;
}

export function ChangeProfilePictureForm({
	profilePicture,
}: ChangeProfilePictureFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const router = useRouter();
	const { user, isLoaded } = useUser();

	if (!user && isLoaded) return redirect("/sign-up");

	const form = useForm<z.infer<typeof editProfilePictureSchema>>({
		resolver: zodResolver(editProfilePictureSchema),
		defaultValues: {
			profilePicture: undefined,
		},
	});

	const onSubmit = useCallback(
		async (data: z.infer<typeof editProfilePictureSchema>) => {
			setSubmitting(true);

			if (!form.formState.isDirty) {
				setSubmitting(false);
				toast.error("No changes detected!", {
					description:
						"Try making some changes to your profile picture before submitting",
					classNames: { title: "font-bold text-md" },
				});
				return;
			}

			if (data.profilePicture) {
				if (data.profilePicture.size > 10 * 1024 * 1024) {
					toast.error(
						"Profile picture must be less than 10MB, please upload a smaller image",
					);
					setSubmitting(false);
					return;
				}
				try {
					const setProfileImageResult = await user?.setProfileImage({
						file: data.profilePicture,
					});
					if (!setProfileImageResult) {
						toast.error("Failed to upload profile picture");
					} else {
						toast.success("Profile picture updated successfully");
					}
				} catch (e) {
					toast.error("Failed to upload profile picture");
					console.error(e);
				}

				setSubmitting(false);
				form.reset({ profilePicture: undefined });
				router.refresh();
			}
		},
		[form.formState.isDirty],
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="profilePicture"
					render={() => (
						<FormItem className="space-y-4">
							<FormLabel className="text-lg">
								Profile Picture
							</FormLabel>
							<Avatar
								className="h-28 w-28 cursor-pointer"
								onClick={() =>
									profilePicture &&
									router.push(profilePicture)
								}
							>
								<AvatarImage
									src={profilePicture ?? undefined}
									alt="Profile picture"
								/>
								<AvatarFallback asChild>
									<Skeleton />
								</AvatarFallback>
							</Avatar>
							<FormControl>
								<FileInput
									currentLink={profilePicture}
									fileValue={
										form.getValues("profilePicture") ??
										undefined
									}
									accept="image/*"
									onChange={(file) =>
										form.setValue("profilePicture", file, {
											shouldDirty: true,
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
