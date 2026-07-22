import type { CustomMessageTriggerEvent } from "aws-lambda";

export async function handler(event: CustomMessageTriggerEvent) {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const name = event.request.userAttributes.given_name;
    // const email = event.request.userAttributes.email;

    const code = event.request.codeParameter;

    event.response.emailSubject = `Recuperar sua senha ${name}!`;
    event.response.emailMessage = `
      Para recuperar a sua conta use este código ${code}
    `;
  }
  return event;
}
