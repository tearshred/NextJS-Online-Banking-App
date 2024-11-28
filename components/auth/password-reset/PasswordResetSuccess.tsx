import { Card, CardBody } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { PasswordIcon } from "../icons/PasswordIcon";

// Success message component shown after successful registration
// Displays while redirecting to homepage
const PasswordResetSuccess: React.FC = () => {
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
              <div className="w-16 h-16 flex items-center justify-center">
                <PasswordIcon fill="text-green-500" width="48" height="48"/>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xl font-bold text-green-500">Password reset succesful</h4>
              <p className="text-gray-600"></p>
              <p className="text-sm text-gray-500">
                Redirecting to login page in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PasswordResetSuccess; 