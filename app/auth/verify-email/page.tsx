"use client"; // Mark as client component since we use hooks

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/app/actions/users/verifyEmail";
import { useState, useEffect, useRef } from "react";

// Wrap the main content in Suspense for better loading handling
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  // Get token from URL query parameters
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // State for UI feedback
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  // useRef is used here because:
  // 1. We need values that persist across re-renders
  // 2. Changes to refs don't trigger re-renders
  // 3. Refs help handle React's strict mode which runs effects twice in development
  // *** IMPORTANT LEARNING POINT ***
  // * The main difference between useState and useRef:
  // * useState: When value changes, component re-renders
  // * useRef: When value changes, component doesn't re-render
  // * Both persist values between renders
  // * In this case, we don't need re-renders when tracking verification attempts, so useRef is the perfect choice.
  const verificationAttempted = useRef(false); // Track if we've tried to verify
  const verificationResult = useRef<{
    success: boolean;
    alreadyVerified: boolean;
  } | null>(null); // Store verification result

  useEffect(() => {
    // Exit early if no token in URL
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verify = async () => {
      // If we've already tried to verify, use the cached result
      // This prevents double verification in React strict mode
      if (verificationAttempted.current) {
        if (verificationResult.current) {
          setStatus("success");
          setMessage(
            verificationResult.current.alreadyVerified
              ? "Email was already verified!"
              : "Email verified successfully!"
          );
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
        return;
      }

      try {
        // Mark that we've attempted verification
        verificationAttempted.current = true;

        // Perform the verification
        const result = await verifyEmail(token);
        // Store the result for future reference
        verificationResult.current = result;

        // Update UI based on verification result
        setStatus("success");
        setMessage(
          result.alreadyVerified
            ? "Email was already verified!"
            : "Email verified successfully!"
        );

        // Redirect to home page after successful verification
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (error) {
        // Handle verification errors
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to verify email. Please try again."
        );
      }
    };

    verify();
  }, [token, router]); // Only re-run if token or router changes

  // Render verification UI with appropriate styling based on status
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p
          className={`${
            status === "error"
              ? "text-red-500"
              : status === "success"
                ? "text-green-500"
                : ""
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
