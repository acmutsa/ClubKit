import { Toaster } from "@/components/ui/sonner";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
	// TODO: protect stuffs from re-registration
	return (
		<>
			{children}
			<Toaster />
		</>
	);
}
