/// <reference types="vite/client" />

import type { IBlog } from "./hooks";

interface IUserData {
    username: string;
    name: string;
    id: number;
    Blogs: IBlog[]
}

interface IUserProfile {
    data: IUserData;
    message: string;
    success: boolean;
}