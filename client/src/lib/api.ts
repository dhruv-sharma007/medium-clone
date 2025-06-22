import type {
  CreateBlogInput,
  SigninInput,
  SignupInput,
  apiResponse,
} from "@medium-clone/common";
import axios from "axios";
import type { IUserProfile } from "../vite-env";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  withCredentials: true,
});

export const signinApi = async (data: SigninInput) => {
  return await api.post<apiResponse>("/user/signin", data);
};

export const signupApi = async (data: SignupInput) => {
  return await api.post<apiResponse>("/user/signup", data);
};
export const signoutApi = async () => {
  return await api.get<apiResponse>("/user/signout");
};

export const getBlogs = async () => {
  return await api.get<apiResponse>("/blog/bulk");
};

export const getBlog = async (id: number) => {
  return await api.get<apiResponse>(`/blog/get/${id}`);
};

export const createBlog = async (data: CreateBlogInput) => {
  return await api.post<apiResponse>(`/blog/post`, data);
};

export const getMeProfile = async () => {
  return await api.get<IUserProfile>(`/user/me`);
};

export const deleteBlog = async (id: number) => {
  return await api.get<apiResponse>(`/blog/delete/${id}`);
};
