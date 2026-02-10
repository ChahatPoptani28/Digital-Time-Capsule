import api from "./axios";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};
