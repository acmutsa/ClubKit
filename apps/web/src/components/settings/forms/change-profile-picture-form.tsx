"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { editProfilePictureSchema } from "@/validators/settings";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FileInput } from "@/components/settings/patterns/file-input";
import { Button } from "@/components/ui/button";

interface ChangeProfilePictureFormProps {
	profilePicture?: string;
}

export function ChangeProfilePictureForm({ profilePicture }: ChangeProfilePictureFormProps) {
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

	const onSubmit = async (data: z.infer<typeof editProfilePictureSchema>) => {
		setSubmitting(true);

		if (data.profilePicture) {
			try {
				const setProfileImageResult = await user?.setProfileImage({ file: data.profilePicture });
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
	}

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
							<Avatar className="w-28 h-28 cursor-pointer" onClick={() => profilePicture && router.push(profilePicture)}>
								<AvatarImage src={profilePicture ?? undefined} alt="Profile picture" />
								<AvatarFallback asChild>
									<Skeleton />
								</AvatarFallback>
							</Avatar>
							<FormControl>
								<FileInput
									currentLink={profilePicture}
									fileValue={form.getValues("profilePicture") ?? undefined}
									accept="image/*"
									onChange={(file) => form.setValue("profilePicture", file, { shouldDirty: true })}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					disabled={!form.formState.isDirty || submitting}
					className="lg:w-32 h-8 mt-4 w-full text-md font-semibold"
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
