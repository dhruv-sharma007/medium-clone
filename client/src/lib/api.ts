import type {
  CreateBlogInput,
  SigninInput,
  SignupInput,
  apiResponse,
} from "@medium-clone/common";
import axios, { type AxiosRequestConfig } from "axios";
import type {
  GetFollowersAndFollowingResponse,
  IBLOGRESPONSE,
  IEditProfileResponse,
  ILOGINRESPONSE,
  IUserProfile,
  TGetBlogsResponse,
  TGetBlogsSearch,
} from "../vite-env";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
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
  },
);

//*********** Profile and user ***********//
export const signinApi = async (data: SigninInput) => {
  return await api.post<ILOGINRESPONSE>("/user/signin", data);
};

export const signupApi = async (data: SignupInput) => {
  return await api.post<apiResponse>("/user/signup", data);
};
export const signoutApi = async () => {
  return await api.get<apiResponse>("/user/signout");
};

export const editProfile = async (payload: object) => {
  return await api.post<IEditProfileResponse>("/user/update-profile", payload, {
    headers: { "Content-Type": "application/json" },
  });
};
export const getAuthor = async (username: string) => {
  return await api.get<IUserProfile>(`/user/getAuthor/${username}`);
};

export const getMeProfile = async () => {
  return await api.get<IUserProfile>(`/user/me`);
};

//*********** CRUD BLOG ***********//
export const getBlogs = async (page: number | undefined) => {
  return await api.get<TGetBlogsResponse>(`/blog/bulk?p=${page}`);
};

export const getBlog = async (id: string) => {
  return await api.get<IBLOGRESPONSE>(`/blog/get/${id}`);
};

export const createBlog = async (data: CreateBlogInput) => {
  return await api.post<apiResponse>(`/blog/post`, data);
};

export const deleteBlog = async (id: string) => {
  return await api.get<apiResponse>(`/blog/delete/${id}`);
};
export const checkUsername = async (
  username: string,
  options: AxiosRequestConfig,
) => {
  return await api.get<apiResponse>(
    `/user/username-check/${username}`,
    options,
  );
};

export const changePublish = async (postId: string, v: boolean) => {
  return await api.put<apiResponse>(`/blog/change-publish`, { postId, v });
};
//*********** Follow unfollow ***********//

export const deleteFollow = async (authorId: string) => {
  return await api.delete<apiResponse>(`/user/follow/${authorId}`);
};

export const createFollow = async (authorId: string) => {
  return await api.get<apiResponse>(`/user/follow/${authorId}`);
};

//*********** Like unlike ***********//

export const createLike = async (data: { userId: string; postId: string }) => {
  return await api.post<apiResponse>(`/blog/like-blog`, data);
};
export const unlike = async (data: { userId: string; postId: string }) => {
  return await api.post<apiResponse>(`/blog/like-blog`, data);
};

export const getComments = async (blogId: string) => {
  return await api.get(`/blog/${blogId}/comments?page=1&limit=35`);
};

export const postComment = async (data: {
  content: string;
  blogid: string;
  userId: string;
}) => {
  return await api.post(`/blog/comment-blog`, data);
};
export const deleteComment = async (id: string) => {
  return await api.delete(`/blog/comment-blog/${id}`);
};
export const getTopUsers = async () => {
  return await api.get(`/user/get-top5`);
};
export const searchPostApi = async (searchTerm: string, options: AxiosRequestConfig,) => {
  return await api.get<TGetBlogsSearch>(`/blog/search/${searchTerm}`, options);
};
export const searchUsers = async (
  name: string,
  options: AxiosRequestConfig,
) => {
  return await api.get(`/user/search/${name}`, options);
};

export const getFollowersAndFollowingApi = async (
  userId: string,
  // options: AxiosRequestConfig,
  page: string,
  limit: string
) => {
  return await api.get<GetFollowersAndFollowingResponse>
    (`/user/getFollowersAndFollowing/${userId}?page=${page}&limit=${limit}`);
};
