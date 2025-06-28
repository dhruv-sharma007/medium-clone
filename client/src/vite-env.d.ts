/// <reference types="vite/client" />

import type { apiResponse, IGetProfileResponse } from "@medium-clone/common";
import type { IBlog } from "./hooks";

interface IUserData {
  username: string;
  name: string;
  id: number;
  Blogs: IBlog[];
}

interface IUserProfile {
  data: IGetProfileResponse;
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
