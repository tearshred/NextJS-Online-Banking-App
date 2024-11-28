import PasswordResetForm from "@/components/auth/password-reset/PasswordResetForm";

export default function ResetPasswordPage({
  params
}: {
  params: { token: string }
}) {
  return <PasswordResetForm token={params.token} />;
} 