"use server";

import React from "react";
import { Resend, CreateEmailOptions, CreateEmailRequestOptions } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { PasswordResetEmailTemplate } from "@/components/email-templates/password-reset";
// import { TwoFactorAuthEmailTemplate } from "@/components/email-templates/two-factor-auth";
// import { VerificationEmailTemplate } from "@/components/email-templates/verification";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = 'welcome' | 'passwordReset' | '2fa' | 'verification';

type EmailPayload = CreateEmailOptions & {
  templateType: EmailType;
  templateData: any; // Dynamic type for data specific to each template
};

export const sendEmail = async (
  { templateType, templateData, ...payload }: EmailPayload,
  options?: CreateEmailRequestOptions
) => {
  const emailContent = generateEmailTemplate(templateType, templateData);

  const data = await resend.emails.send({ ...payload, react: emailContent }, options);

  console.log("Email sent successfully");

  return data;
};

// Updated function using React.createElement for each template
function generateEmailTemplate(templateType: EmailType, templateData: any): React.ReactElement {
    switch (templateType) {
      case "welcome":
        return React.createElement(EmailTemplate, templateData);
      case "passwordReset":
        return React.createElement(PasswordResetEmailTemplate, templateData);
    //   case "2fa":
    //     return React.createElement(TwoFactorAuthEmailTemplate, templateData);
    //   case "verification":
    //     return React.createElement(VerificationEmailTemplate, templateData);
      default:
        throw new Error("Invalid email template type");
    }
  }
