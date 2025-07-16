/// <reference types="vite/client" />

// import typfrom "@medium-clone/common";
import type { IBlog } from "./hooks";

interface IUserData {
  username: string;
  name: string;
  id: number;
  Blogs: IBlog[];
}

interface IUserProfile {
  data: IGetProfileResp;
  message: string;
  success: boolean;
}

interface IProfileUpdate {
  name?: string;
  username?: string;
  bio?: string;
  profilePic?: string;
}

interface IPROFILE {
  username: string;
  id: string;
  profilePic?: string;
  name: string;
  bio?: string;
}

export interface IEditProfileResponse {
  data: IPROFILE;
  message: string;
  success: boolean;
}

export interface ILOGINRESPONSE {
  data: IPROFILE;
  message: string;
  success: boolean;
}

export type POST = {
  id: string;
  title: string;
  featuredImg: string;
  isPublished: boolean;
  slug: string;
  createdAt: string; // or Date if parsed
  _count: {
    comments: number;
    likes: number;
  };
  user: {
    id: string;
    name: string;
    username: string;
    profilePic: string;
    bio: string;
  };
  isLikedByUser?: boolean;
};

export type TGetBlogsResponse = {
  success: boolean;
  message: string;
  data: {
    totalPosts: number;
    posts: POST[];
  };
};
export type TGetBlogsSearch = {
  success: boolean;
  message: string;
  data: POST[]
};

export interface IGetProfileResp {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
  followers: number;
  following: number;
  Blogs: POST[];
  postCount: number;
  isUserFollowing: boolean;
  isFollowedByAuthor: boolean;
}

// Define the shape of a Blog object returned from the backend
export interface IBlogUser {
  id: string;
  name: string;
  username: string;
  bio?: string | null;
  profilePic?: string | null;
}

export interface IBlogCount {
  likes: number;
  comments: number;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  featuredImg?: string | null;
  _count: IBlogCount;
  user: IBlogUser;
  isLikedByUser: boolean;
}

export interface IBLOGRESPONSE {
  data: IPost;
  message: string;
  success: boolean;
}

export interface IUserMini {
  id: string;
  username: string;
  name: string;
  profilePic: string | null;
}

export interface IComment {
  id: string;
  content: string;
  blogid: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: IUserMini;
}
export interface ITopUser {
  id: string;
  name: string | null;
  username: string;
  profilePic: string | null;
  bio: string | null;
  _count: {
    followers: number;
  };
}
