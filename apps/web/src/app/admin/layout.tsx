import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import FullScreenMessage from "@/components/shared/fullscreen-message";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkID, userId),
  });

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    console.log("Denying admin access to user", user);
    return (
      <FullScreenMessage
        title="Access Denied"
        message="You are not an admin. If you belive this is a mistake, please contact a administrator."
      />
    );
  }
  return <div>{children}</div>;
}
