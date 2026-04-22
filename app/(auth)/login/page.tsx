import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage(props: LoginPageProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const oauthDenied = searchParams.error === "AccessDenied";
  const signupRequired = searchParams.error === "SignupRequired";
  const oauthCallbackFailed = searchParams.error === "OAuthCallback";

  return (
    <LoginForm
      oauthDenied={oauthDenied}
      signupRequired={signupRequired}
      oauthCallbackFailed={oauthCallbackFailed}
    />
  );
}
