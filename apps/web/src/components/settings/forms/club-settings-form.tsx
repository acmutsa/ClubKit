"use client";

import { editClubSettingsSchema } from "@/validators/settings";
import { editClubSettings } from "@/actions/settings/edit";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { PopoverSelect } from "@/components/shared/popover-select";
import { ShirtSizeType, ShirtType } from "@/lib/types/shared";
import c from "config";

interface OrganizationSettingsPageProps {
	shirtType: ShirtType;
	shirtSize: ShirtSizeType;
}

// TODO: Figure out what types of interested events users can select.  Fix padding on interested event types.
export function ClubSettingsForm({
	shirtSize,
	shirtType,
}: OrganizationSettingsPageProps) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<z.infer<typeof editClubSettingsSchema>>({
		resolver: zodResolver(editClubSettingsSchema),
		defaultValues: {
			shirtSize,
			shirtType,
		},
	});

	const { execute } = useAction(editClubSettings, {
		onSettled: () => setSubmitting(false),
		onExecute: () => setSubmitting(true),
		onSuccess: () => {
			toast.success("Organization settings updated");
			form.reset(form.getValues());
		},
		onError: (error) => {
			toast.error("Failed to update organization settings");
			console.error(error);
		},
	});

	const handleSubmit = useCallback(
		(data: z.infer<typeof editClubSettingsSchema>) => {
			if (!form.formState.isDirty) {
				toast.error("No changes detected!", {
					description:
						"Try making some changes to your club settings before submitting",
					classNames: { title: "font-bold text-md" },
				});
				return;
			}

			execute(data);
		},
		[form.formState.isDirty, execute],
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="space-y-6">
					<div className="space-y-10">
						<FormField
							control={form.control}
							name="shirtSize"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg">
										Shirt Size
									</FormLabel>
									<FormControl>
										<PopoverSelect
											options={
												c.userIdentityOptions.shirtSize
											}
											value={field.value}
											topic="shirt size"
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="shirtType"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg">
										Shirt Type
									</FormLabel>
									<FormControl>
										<PopoverSelect
											value={field.value}
											onChange={field.onChange}
											options={
												c.userIdentityOptions.shirtType
											}
											topic="shirt type"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={submitting}
							className="w-full text-lg font-semibold lg:w-32"
						>
							{submitting ? (
								<LoaderCircle className="h-5 w-5 animate-spin" />
							) : (
								"Update"
							)}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
