"use server"

import React from 'react';

interface PasswordResetEmailTemplateProps {
  email: string;
  resetPasswordToken: string;
  resetLink: string;
}

export const PasswordResetEmailTemplate: React.FC<Readonly<PasswordResetEmailTemplateProps>> = ({
  email, resetPasswordToken, resetLink
}) => (
  <div>
    <h1>Reset Password for <b>{email}</b></h1>
    <p>Please follow the link below to reset your password. Link will expire after 24 hours</p>
    <a href={`${resetLink}/auth/reset-password?token=${resetPasswordToken}`}>
      Click here to reset pasword
    </a>
  </div>
);