// import twilio from "twilio";
const accountSid = "Your-accountSid";
const authToken = "Your-authToken";

// !NOTE: This file contains configuration for sending OTP via SMS using TWILIO.
//  It was used for testing purposes and is not recommended for production use.
//  Please review and update as needed before deploying.

const client = twilio(accountSid, authToken);
export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  try {
    // Send OTP via SMS
    const response = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+201064932995",
      to: toPhoneNumber,
    });
    return response;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
