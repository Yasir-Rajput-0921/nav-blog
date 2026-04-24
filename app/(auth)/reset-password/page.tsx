import ResetPasswordForm from "./reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage(
  props: ResetPasswordPageProps
) {
  const searchParams = await props.searchParams;
  const token = searchParams.token || "";

  return <ResetPasswordForm token={token} />;
}