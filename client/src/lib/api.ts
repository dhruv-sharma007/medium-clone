import type {
  CreateBlogInput,
  SigninInput,
  SignupInput,
  apiResponse,
} from "@medium-clone/common";
import axios, { type AxiosRequestConfig } from "axios";
import type { IUserProfile } from "../vite-env";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Call the logout function from the auth store
      useAuthStore.getState().logout();

      // Optional: redirect to signin
      window.location.href = "/signin"; // change path as needed
    }

    return Promise.reject(error);
  }
);

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

export const getBlog = async (id: string) => {
  return await api.get<apiResponse>(`/blog/get/${id}`);
};

export const createBlog = async (data: CreateBlogInput) => {
  return await api.post<apiResponse>(`/blog/post`, data);
};

export const getMeProfile = async () => {
  return await api.get<IUserProfile>(`/user/me`);
};

export const deleteBlog = async (id: string) => {
  return await api.get<apiResponse>(`/blog/delete/${id}`);
};
export const checkUsername = async (username: string, options: AxiosRequestConfig) => {
  return await api.get<apiResponse>(`/user/username-check/${username}`, options);
};
export const editProfile = async () => {
  return await api.get<apiResponse>(`/user/`);
};
