"use client";

import { editClubSettingsSchema } from "@/validators/settings";
import { editClubSettings } from "@/actions/settings/edit";
import { Separator } from "@/components/ui/separator";
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
import { useState } from "react";
import { PopoverSelect } from "@/components/settings/patterns/popover-select";

const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const shirtTypes = ["Unisex", "Women's"] as const;

interface OrganizationSettingsPageProps {
	shirtType: string;
	shirtSize: string;
}

// TODO: Figure out what types of interested events users can select.  Fix padding on interested event types.
export function ClubSettingsForm({ shirtSize, shirtType }: OrganizationSettingsPageProps) {
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
			form.reset(form.getValues())
		},
		onError: (error) => {
			toast.error("Failed to update organization settings");
			console.error(error);
		},
	});

	const handleSubmit = (data: z.infer<typeof editClubSettingsSchema>) => {
		execute(data);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="space-y-6">
					<div>
						<h1 className="text-4xl font-bold">Club</h1>
						<p className="text-muted-foreground">
							Edit your club related settings here
						</p>
					</div>
					<Separator className="my-6" />
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
											options={shirtSizes}
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
									<FormLabel className="text-lg">Shirt Type</FormLabel>
									<FormControl>
										<PopoverSelect
											value={field.value}
											onChange={field.onChange}
											options={shirtTypes}
											topic="shirt type"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={submitting || !form.formState.isDirty}
							className="lg:w-32 w-full text-lg font-semibold"
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
	)
}
