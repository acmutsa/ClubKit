"use client";

import { editAcademicSettings } from "@/actions/settings/edit";
import { editAcademicSettingsSchema } from "@/validators/settings";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { range } from "@/lib/utils";
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
import { useEffect, useState } from "react";
import { majors } from "config";
import { PopoverCommand } from "@/components/shared/popover-command";
import { PopoverSelect } from "@/components/shared/popover-select";

interface SchoolSettingsFormProps {
	major: string;
	classification: string;
	graduationMonth: number;
	graduationYear: number;
}

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function SchoolSettingsForm({
	graduationMonth,
	graduationYear,
	classification,
	major,
}: SchoolSettingsFormProps) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<z.infer<typeof editAcademicSettingsSchema>>({
		resolver: zodResolver(editAcademicSettingsSchema),
		defaultValues: {
			classification,
			graduationMonth,
			graduationYear,
			major,
		},
	});

	useEffect(() => {
		console.log(typeof form.getValues().graduationMonth);
		console.log(form.getValues().graduationMonth);
	}, [form.formState]);

	const { execute } = useAction(editAcademicSettings, {
		onExecute: () => setSubmitting(true),
		onSettled: () => setSubmitting(false),
		onSuccess: () => {
			toast.success("Academic information updated successfully");
			form.reset(form.getValues());
		},
		onError: (error) => {
			toast.error("Failed to update academic information");
			console.error(error);
		},
	});

	const handleSubmit = (data: z.infer<typeof editAcademicSettingsSchema>) => {
		execute(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="space-y-6">
					<div className="space-y-10">
						<FormField
							control={form.control}
							name="major"
							render={({ field }) => (
								<FormItem className="col-span-3 md:col-span-2">
									<FormLabel className="text-lg">
										Major
									</FormLabel>
									<FormControl>
										<PopoverCommand
											value={field.value}
											onChange={field.onChange}
											options={majors}
											topic="major"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="classification"
							render={({ field }) => (
								<FormItem className="col-span-3 md:col-span-2">
									<FormLabel className="text-lg">
										Classification
									</FormLabel>
									<FormControl>
										<PopoverSelect
											options={[
												"freshman",
												"sophomore",
												"junior",
												"senior",
											]}
											value={field.value}
											topic="classification"
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="space-y-2">
							<FormField
								control={form.control}
								name="graduationMonth"
								render={({ field }) => (
									<FormItem className="col-span-3">
										<FormLabel className="text-lg">
											Graduation Month
										</FormLabel>
										<FormControl>
											<PopoverSelect
												onChange={(value) =>
													field.onChange(
														parseInt(value),
													)
												}
												options={range(1, 13).map(
													String,
												)}
												optionNames={months}
												topic="month"
												value={field.value.toString()}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="space-y-2">
							<FormField
								control={form.control}
								name="graduationYear"
								render={({ field }) => (
									<FormItem className="col-span-3">
										<FormLabel className="text-lg">
											Graduation Year
										</FormLabel>
										<FormControl>
											<PopoverSelect
												onChange={(value) =>
													field.onChange(
														parseInt(value),
													)
												}
												options={range(
													new Date().getFullYear(),
													new Date().getFullYear() +
														5,
												).map((year) =>
													year.toString(),
												)}
												topic="year"
												value={field.value.toString()}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button
							type="submit"
							disabled={!form.formState.isDirty || submitting}
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
