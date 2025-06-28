/// <reference types="vite/client" />

import type { IGetProfileResponse } from "@medium-clone/common";
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