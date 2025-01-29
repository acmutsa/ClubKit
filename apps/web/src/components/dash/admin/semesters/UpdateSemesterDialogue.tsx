"use client";

import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import { updateSemester } from "@/actions/semester";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateSemesterSchema } from "db/zod";
import { Loader2 } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
	SEMESTER_DATE_RANGE_EXISTS,
	SEMESTER_NAME_EXISTS,
} from "@/lib/constants/semesters";
import { DatePickerWithRange } from "@/components/ui/date-time-picker/date-picker-with-range";
import { addDays } from "date-fns";
import { SEMESTER_DAYS_OFFSET } from "@/lib/constants/semesters";
import { Semester } from "db/types";

type UpdateSemesterProps = {
	semesterData: Semester;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateSemesterDialogue(props: UpdateSemesterProps) {
	const { semesterData: semesterProps, setOpen, open } = props;
	const form = useForm<z.infer<typeof updateSemesterSchema>>({
		resolver: zodResolver(updateSemesterSchema),
		defaultValues: {
			...semesterProps,
		},
	});

	const { execute: runUpdateSemester, status } = useAction(updateSemester, {
		onSuccess: ({ data }) => {
			toast.dismiss();
			if (data?.code == SEMESTER_DATE_RANGE_EXISTS) {
				return toast.error(
					`${data?.semesterName} has dates that overlap with the new semester`,
				);
			} else if (data?.code == SEMESTER_NAME_EXISTS) {
				return toast.error(
					`${data?.semesterName} already exists. Please choose a different name`,
				);
			}
			setOpen(false);
			form.reset();
			toast.success("Semester updated successfully");
		},
		onError: () => {
			toast.dismiss();
			toast.error("Failed to update semester");
		},
	});

	useEffect(() => {
		console.log("form dirty", form.formState.isDirty);
	}, [form.formState.isDirty]);

	function onSubmit(data: z.infer<typeof updateSemesterSchema>) {
		if (!form.formState.isDirty) {
			return toast.error("No changes made");
		}
		runUpdateSemester(data);
	}

	const isLoading = status === "executing";

	return (
		<>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Event Category</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Semester Title</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter Title"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex w-full flex-row items-center justify-between gap-x-3">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col space-y-1">
										<FormLabel>Semester Duration</FormLabel>
										<DatePickerWithRange
											start={field.value}
											end={form.getValues("endDate")}
											onRangeChange={(range) => {
												if (range) {
													form.setValue(
														"startDate",
														range.from ??
															new Date(),
														{
															shouldDirty: true,
														},
													);
													form.setValue(
														"endDate",
														range.to ??
															new Date(
																Date.now() +
																	SEMESTER_DAYS_OFFSET,
															),
														{
															shouldDirty: true,
														},
													);
												}
											}}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="pointsRequired"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Points Required</FormLabel>
									<FormControl>
										<Input
											{...field}
											onChange={(e) =>
												field.onChange(
													parseInt(e.target.value),
												)
											}
											type="number"
											placeholder="Enter Points Required"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={isLoading}
								className="flex justify-end"
							>
								{isLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Update"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</>
	);
}
