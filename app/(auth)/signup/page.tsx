import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignupForm from "./signup-form";

type SignupPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage(props: SignupPageProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const emailExists = searchParams.error === "EmailExists";

  return <SignupForm emailExists={emailExists} />;
}
