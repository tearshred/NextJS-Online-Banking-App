"use client";

import { useEffect, useState } from "react";
import { Input, Button, Card, CardHeader, CardBody, CircularProgress } from "@nextui-org/react";
import { requestPasswordReset } from "@/app/actions/users/resetPassword";
import { useRouter } from "next/navigation";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('') // Clear status message. Should not happen most cases
    setLoading (true) // Set loading to true which is used to trigger circular progress

    try {
      const message = await requestPasswordReset(email);
      setStatus(message);
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  };

  // Countdown effect
  useEffect(() => {
    if (status) { // Only start countdown if there is a status message
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timer); // Clear the timer
            router.push('/auth/login'); // Redirect to login page
            return 0; // Ensure countdown doesn't go below 0
          }
        });
      }, 1000); // Update every 1000ms (1 second)

      // Cleanup interval on component unmount
      return () => clearInterval(timer);
    }
  }, [status, router]); // Include status and router in the dependency array

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-md mx-auto">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          {status ? ( // Check if there's a status message
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600" // Adjust size and color as needed
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l9 5 9-5M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 5 9-5"
              />
            </svg>
          ) : (
            <h4 className="font-bold text-large">Reset Password</h4> // Show title if no status
          )}
        </CardHeader>
        <CardBody>
          {status ? ( // Check if there's a status message
            <>
            <p className="mt-4 text-center text-green-600">{status}</p> {/* Display success or error message */}
            <p className="mt-4 text-sm text-center text-gray-500">
              Redirecting to login in {countdown}{" "}
              {countdown === 1 ? "second" : "seconds"}...
            </p>
          </>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                variant="bordered"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <Button color="primary" type="submit" className="w-full" disabled={loading}>
              {loading ? <CircularProgress size="sm" /> : 'Send Reset Link'} {/* Show CircularProgress when loading */}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
