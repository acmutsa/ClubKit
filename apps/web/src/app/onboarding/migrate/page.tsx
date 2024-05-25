import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Migrator from "@/components/onboarding/migrator";

export default function Page() {
	return (
		<main className="flex min-h-screen w-screen items-center justify-center">
			<div>
				<h1 className="pb-5 text-5xl font-black">Migrate</h1>
				<Migrator />
			</div>
		</main>
	);
}
