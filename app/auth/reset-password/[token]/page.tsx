import PasswordResetForm from "@/components/auth/PasswordResetForm";

export default function ResetPasswordPage({
  params
}: {
  params: { token: string }
}) {
  return <PasswordResetForm token={params.token} />;
} 