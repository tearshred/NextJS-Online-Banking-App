"use client";

import { useState } from 'react';
import { Input, Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import { requestPasswordReset } from "@/app/actions/users/resetPassword";

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const message = await requestPasswordReset(email);
      setStatus(message);
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-md mx-auto">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <h4 className="font-bold text-large">Reset Password</h4>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Button color="primary" type="submit" className="w-full">
              Send Reset Link
            </Button>
            {status && <p className="mt-4 text-center">{status}</p>}
          </form>
        </CardBody>
      </Card>
    </div>
  );
} 