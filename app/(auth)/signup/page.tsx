import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignupForm from "./signup-form";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return <SignupForm />;
}
