import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "db/zod";

type NewEventFormProps = {
  defaultDate: Date;
};

const formSchema = insertEventSchema.merge(
  // @ts-ignore
  z.object({ categories: z.string().array() })
);

export default function NewEventForm({ defaultDate }: NewEventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: defaultDate,
      endTime: new Date(defaultDate.getTime() + 1000 * 60 * 60 * 24),
    },
  });

  return (
    <div className="text-foreground">
      <Form {...form}></Form>
    </div>
  );
}
