import { FormLabel } from "../ui/form";
export default function FormDisplayName({
	displayName,
	required: isOptional,
}: {
	displayName: string;
	required: boolean;
}) {
	return <FormLabel>{`${displayName} ${!isOptional && " *"} `}</FormLabel>;
}
