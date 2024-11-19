"use server"

import React from 'react';

interface VerifyEmailTemplateProps {
  email: string;
  emailVerificationToken: string;
  resetLink: string;
}

export const VerifyEmailTemplate: React.FC<Readonly<VerifyEmailTemplateProps>> = ({
  email,
  resetLink
}) => (
  <div>
    <h1>Verify Email for <b>{email}</b></h1>
    <p>Please follow the link below to verify your email. Link will expire after 24 hours</p>
    <a href={resetLink}>
      Click here to verify your email
    </a>
  </div>
);