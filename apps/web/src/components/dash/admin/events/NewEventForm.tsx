"use client";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "db/zod";
import { CalendarWithYears } from "@/components/ui/calendarWithYearSelect";
import { FormGroupWrapper } from "@/components/shared/form-group-wrapper";
import { DateTimePicker } from "@/components/ui/date-time-picker/date-time-picker";

type NewEventFormProps = {
	defaultDate: Date;
	categoryOptions: { id: string; name: string; color: string }[];
};

const formSchema = insertEventSchema.merge(
	// @ts-ignore
	z.object({ categories: z.string().array() }),
);

export default function NewEventForm({
	defaultDate,
	categoryOptions,
}: NewEventFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			start: defaultDate,
			end: new Date(defaultDate.getTime() + 1000 * 60 * 60 * 24),
			categories: [],
		},
	});
	const [differentCheckinTime, setDifferentCheckinTime] = useState(false);

	const onSubmit = () => {};

	return (
		<div className="text-foreground">
			<Form {...form}>
				<form
					className="space-y-8"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormGroupWrapper title="Basic Info">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea {...field}></Textarea>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FormGroupWrapper>
					<FormGroupWrapper title="Time & Location">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="start"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start</FormLabel>
										<DateTimePicker
											value={
												!!field.value
													? parseAbsolute(
															field.value.toISOString(),
															getLocalTimeZone(),
														)
													: null
											}
											onChange={(date) => {
												field.onChange(
													!!date
														? date.toDate(
																getLocalTimeZone(),
															)
														: null,
												);
											}}
											shouldCloseOnSelect={false}
											granularity={"minute"}
											label="Event Start"
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end"
								render={({ field }) => (
									<FormItem>
										<FormLabel>End</FormLabel>
										<DateTimePicker
											value={
												!!field.value
													? parseAbsolute(
															field.value.toISOString(),
															getLocalTimeZone(),
														)
													: null
											}
											onChange={(date) => {
												field.onChange(
													!!date
														? date.toDate(
																getLocalTimeZone(),
															)
														: null,
												);
											}}
											shouldCloseOnSelect={false}
											granularity={"minute"}
											label="Event End"
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex items-center gap-x-2">
							<FormLabel>Use Different Check-In Time?</FormLabel>
							<Switch
								checked={differentCheckinTime}
								onCheckedChange={() => {
									setDifferentCheckinTime((prev) => !prev);
								}}
								aria-readonly
							/>
						</div>
						{differentCheckinTime && (
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="checkinStart"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Check-In Start
											</FormLabel>
											<DateTimePicker
												value={
													!!field.value
														? parseAbsolute(
																field.value.toISOString(),
																getLocalTimeZone(),
															)
														: null
												}
												onChange={(date) => {
													field.onChange(
														!!date
															? date.toDate(
																	getLocalTimeZone(),
																)
															: null,
													);
												}}
												shouldCloseOnSelect={false}
												granularity={"minute"}
												label="Check-In Start"
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="checkinEnd"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Check-In End</FormLabel>
											<DateTimePicker
												value={
													!!field.value
														? parseAbsolute(
																field.value.toISOString(),
																getLocalTimeZone(),
															)
														: null
												}
												onChange={(date) => {
													field.onChange(
														!!date
															? date.toDate(
																	getLocalTimeZone(),
																)
															: null,
													);
												}}
												shouldCloseOnSelect={false}
												granularity={"minute"}
												label="Check-In End"
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<Input
										{...field}
										placeholder="Ex: ACM Room"
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FormGroupWrapper>
					<FormGroupWrapper title="Additional">
						<FormField
							name="categories"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex flex-col justify-between gap-y-1">
									<FormLabel>Categories</FormLabel>
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
												{categoryOptions.map(
													({ id, name, color }) => (
														<MultiSelectorItem
															key={id}
															value={name}
														>
															{name}
														</MultiSelectorItem>
													),
												)}
											</MultiSelectorList>
										</MultiSelectorContent>
									</MultiSelector>
								</FormItem>
							)}
						/>
						<FormField
							name="isUserCheckinable"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex w-1/4 items-center justify-between">
									<FormLabel>Check-In</FormLabel>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-readonly
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="isHidden"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex w-1/4 items-center justify-between">
									<FormLabel>Hidden</FormLabel>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-readonly
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FormGroupWrapper>
				</form>
			</Form>
		</div>
	);
}
