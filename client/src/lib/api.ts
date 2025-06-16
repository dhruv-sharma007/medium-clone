import type { SigninInput, SignupInput } from "@medium-clone/common";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  withCredentials: true,
});

export const signinApi = async (data: SigninInput) => {
  // console.log(data)
  return await api.post("/user/signin", data);
};

export const signupApi = async (data: SignupInput) => {
  return await api.post("/user/signup", data);
};

export const getBlogs = async () => {
  return await api.get("/blog/bulk");
};

export const getBlog = async (id: number) => {
  return await api.get(`/blog/get/${id}`);
};
