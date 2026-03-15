import API from "./axios";

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return API.post("/auth/login", data);
};

export const verifyOTP = (data: {
  email: string;
  otp: string;
}) => {
  return API.post("/auth/verify-otp", data);
};

export const resendOTP = (data: { email: string }) => {
  return API.post("/auth/resend-otp", data);
};
