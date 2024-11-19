import { Card, CardBody } from "@nextui-org/react";

// Success message component shown after successful registration
// Displays while redirecting to homepage
const SignUpSuccess: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-[440px]">
        <CardBody className="py-10">
          <div className="text-center">
            <h4 className="text-large font-bold text-success">Registration Successful!</h4>
            <p className="mt-2">Redirecting to homepage...</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignUpSuccess; 