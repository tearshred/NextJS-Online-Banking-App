"use server"

import React from 'react';
import { Body, Container, Head, Html, Link, Preview, Section, Text } from '@react-email/components'
interface VerifyEmailTemplateProps {
  email: string;
  emailVerificationToken: string;
  verifyLink: string;
}

export const VerifyEmailTemplate: React.FC<Readonly<VerifyEmailTemplateProps>> = ({
  email,
  verifyLink
}) => (
  <Html>
    <Head>
      <title>Verify Your Email</title>
    </Head>
    <Preview>Verify your email for {email}</Preview>
    <Body>
    <Container className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <Head className="text-2xl text-gray-800 mb-4">Verify Email for <b>{email}</b></Head>
          <Text className="text-gray-600 mb-4">Please follow the link below to verify your email. The link will expire after 24 hours.</Text>
          <Link href={verifyLink} className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-300">Click here to verify your email</Link>
        </Container>
    </Body>
  </Html>
);