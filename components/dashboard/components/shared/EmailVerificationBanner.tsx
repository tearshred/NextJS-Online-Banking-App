import { Card, CardBody } from "@nextui-org/react";

interface EmailVerificationBannerProps {
  verificationEmailSent: boolean;
  onResendVerification: () => void;
}

export const EmailVerificationBanner = ({ 
  verificationEmailSent, 
  onResendVerification 
}: EmailVerificationBannerProps) => {
  return (
    <Card className={`w-full ${verificationEmailSent ? 'bg-success-50' : 'bg-warning-50'}`}>
      <CardBody className="py-3 text-center">
        <p className={verificationEmailSent ? 'text-success-600' : 'text-warning-600'}>
          {verificationEmailSent ? (
            "Email verification link sent. Please check your email"
          ) : (
            <>
              Email address not verified. Please check your email or{" "}
              <a
                href="javascript:void(0)"
                className="text-warning-700 hover:text-warning-800 underline"
                onClick={onResendVerification}
              >
                click here 
              </a>{" "}
              to resend verification email.
            </>
          )}
        </p>
      </CardBody>
    </Card>
  );
};
