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
import { CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "db/zod";
import { CalendarWithYears } from "@/components/ui/calendarWithYearSelect";
import { FormGroupWrapper } from "@/components/shared/form-group-wrapper";

type NewEventFormProps = {
	defaultDate: Date;
};

const formSchema = insertEventSchema.merge(
	// @ts-ignore
	z.object({ categories: z.string().array() }),
);

export default function NewEventForm({ defaultDate }: NewEventFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			start: defaultDate,
			end: new Date(defaultDate.getTime() + 1000 * 60 * 60 * 24),
			categories: [],
		},
	});

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
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"block flex pl-3 text-left font-normal",
															!field.value &&
																"text-muted-foreground",
														)}
													>
														{field.value ? (
															format(
																field.value,
																"PPP",
															)
														) : (
															<span>
																Pick a Date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<CalendarWithYears
													captionLayout="dropdown-buttons"
													mode="single"
													selected={
														field.value == null
															? undefined
															: field.value
													}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() ||
														date <
															new Date(
																"1900-01-01",
															)
													}
													fromYear={
														new Date().getFullYear() -
														100
													}
													toYear={new Date().getFullYear()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
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
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"block flex pl-3 text-left font-normal",
															!field.value &&
																"text-muted-foreground",
														)}
													>
														{field.value ? (
															format(
																field.value,
																"PPP",
															)
														) : (
															<span>
																Pick a Date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<CalendarWithYears
													captionLayout="dropdown-buttons"
													mode="single"
													selected={
														field.value == null
															? undefined
															: field.value
													}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() ||
														date <
															new Date(
																"1900-01-01",
															)
													}
													fromYear={
														new Date().getFullYear() -
														100
													}
													toYear={new Date().getFullYear()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex items-center gap-x-2">
							<FormLabel>Use Different Check-In Time?</FormLabel>
							<Switch
								checked={true}
								onCheckedChange={() => {}}
								aria-readonly
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="start"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Check-In Start</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"block flex pl-3 text-left font-normal",
															!field.value &&
																"text-muted-foreground",
														)}
													>
														{field.value ? (
															format(
																field.value,
																"PPP",
															)
														) : (
															<span>
																Pick a Date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<CalendarWithYears
													captionLayout="dropdown-buttons"
													mode="single"
													selected={
														field.value == null
															? undefined
															: field.value
													}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() ||
														date <
															new Date(
																"1900-01-01",
															)
													}
													fromYear={
														new Date().getFullYear() -
														100
													}
													toYear={new Date().getFullYear()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Check-In End</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"block flex pl-3 text-left font-normal",
															!field.value &&
																"text-muted-foreground",
														)}
													>
														{field.value ? (
															format(
																field.value,
																"PPP",
															)
														) : (
															<span>
																Pick a Date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<CalendarWithYears
													captionLayout="dropdown-buttons"
													mode="single"
													selected={
														field.value == null
															? undefined
															: field.value
													}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() ||
														date <
															new Date(
																"1900-01-01",
															)
													}
													fromYear={
														new Date().getFullYear() -
														100
													}
													toYear={new Date().getFullYear()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
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
												<MultiSelectorItem
													key="Category name"
													value="some foreign key"
												>
													Category name
												</MultiSelectorItem>
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
								<FormItem className="flex items-center gap-x-2">
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
								<FormItem className="flex items-center gap-x-2">
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
