import { Card, CardBody } from "@nextui-org/react";
import { useState, useEffect } from "react";

// Success message component shown after successful registration
// Displays while redirecting to homepage
const SignUpSuccess: React.FC = () => {
  const [countdown, setCountdown] = useState(5); // 5 seconds countdown

  // Countdown effect
  useEffect(() => {
    // Start countdown immediately
    const timer = setInterval(() => {
      setCountdown((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000); // Update every 1000ms (1 second)

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-[440px] shadow-lg">
        <CardBody className="py-10">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-green-500">Registration Successful!</h4>
              <p className="text-gray-600">Please check your email for verification.</p>
              <p className="text-sm text-gray-500">
                Redirecting to homepage in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignUpSuccess; 