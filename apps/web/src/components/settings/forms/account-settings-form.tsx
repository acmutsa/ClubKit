"use client";

import { Input } from "@/components/ui/input";
import { editAccountSettings } from "@/actions/settings/edit";
import { editAccountSettingsSchema } from "@/validators/settings";
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
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from "@/components/ui/MultiSelect";
import { PopoverCalendar } from "@/components/shared/popover-calendar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import c from "config";
import { useState, useCallback } from "react";
import { GenderType, EthnicityType } from "@/lib/types/shared";

interface AccountInfoProps {
	firstName: string;
	lastName: string;
	gender: GenderType[];
	ethnicity: EthnicityType[];
	birthday: Date | undefined;
}

export function AccountSettingsForm({
	firstName,
	lastName,
	gender,
	ethnicity,
	birthday,
}: AccountInfoProps) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<z.infer<typeof editAccountSettingsSchema>>({
		resolver: zodResolver(editAccountSettingsSchema),
		defaultValues: {
			firstName,
			lastName,
			gender,
			ethnicity,
			birthday,
		},
	});

	const { execute } = useAction(editAccountSettings, {
		onExecute: () => setSubmitting(true),
		onSettled: () => setSubmitting(false),
		onSuccess: ({ input }) => {
			toast.success("Account settings updated successfully");
			form.reset(input);
		},
		onError: (error) => {
			toast.error("Failed to update name");
			console.error(error);
		},
	});

	const handleSubmit = useCallback(
		(data: z.infer<typeof editAccountSettingsSchema>) => {
			if (!form.formState.isDirty) {
				toast.error("No changes detected!", {
					description:
						"Try making some changes to your account settings before submitting",
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
					<div className="space-y-8">
						<div className="flex flex-col gap-4 lg:flex-row [&>*]:flex-1">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel className="text-lg">
											First Name
										</FormLabel>
										<FormControl>
											<Input
												className="text-md"
												type="text"
												autoComplete="off"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel className="text-lg">
											Last Name
										</FormLabel>
										<FormControl>
											<Input
												className="text-md"
												type="text"
												autoComplete="off"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<div className="space-y-2">
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-col justify-between gap-y-1">
											<FormLabel className="text-lg">
												Gender
											</FormLabel>
											<MultiSelector
												onValuesChange={field.onChange}
												values={field.value}
												loop={true}
											>
												<MultiSelectorTrigger>
													<MultiSelectorInput
														className="text-sm"
														placeholder="Click to Select"
													/>
												</MultiSelectorTrigger>
												<MultiSelectorContent>
													<MultiSelectorList>
														<MultiSelectorItem
															key="Male"
															value="Male"
														>
															Male
														</MultiSelectorItem>
														<MultiSelectorItem
															key="Female"
															value="Female"
														>
															Female
														</MultiSelectorItem>
														<MultiSelectorItem
															key="Non-Binary"
															value="Non-Binary"
														>
															Non-Binary
														</MultiSelectorItem>
														<MultiSelectorItem
															key="Transgender"
															value="Transgender"
														>
															Transgender
														</MultiSelectorItem>
														<MultiSelectorItem
															key="Intersex"
															value="Intersex"
														>
															Intersex
														</MultiSelectorItem>
														<MultiSelectorItem
															key="Other"
															value="Other"
														>
															Other
														</MultiSelectorItem>
														<MultiSelectorItem
															key="I prefer not to say"
															value="I prefer not to say"
														>
															I prefer not to say
														</MultiSelectorItem>
													</MultiSelectorList>
												</MultiSelectorContent>
											</MultiSelector>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>
						<div className="space-y-2">
							<FormField
								control={form.control}
								name="ethnicity"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-col justify-between gap-y-1">
											<FormLabel className="text-lg">
												Ethnicity
											</FormLabel>
											<MultiSelector
												onValuesChange={field.onChange}
												values={field.value}
												loop={true}
											>
												<MultiSelectorTrigger>
													<MultiSelectorInput
														className="text-sm"
														placeholder="Click to Select"
													/>
												</MultiSelectorTrigger>
												<MultiSelectorContent>
													<MultiSelectorList>
														{c.userIdentityOptions.ethnicity.map(
															(value) => (
																<MultiSelectorItem
																	key={value}
																	value={
																		value
																	}
																>
																	{value}
																</MultiSelectorItem>
															),
														)}
													</MultiSelectorList>
												</MultiSelectorContent>
											</MultiSelector>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>
						<FormField
							control={form.control}
							name="birthday"
							render={({ field }) => (
								<FormItem className="max-w-3xl space-y-2">
									<FormLabel className="text-lg">
										Birthday
									</FormLabel>
									<FormMessage />
									<FormControl className="flex gap-3">
										<PopoverCalendar
											date={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
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
