import type { ComponentType } from "react";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Blogs from "../pages/Blogs";
import Blog from "../pages/Blog";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import ProfileSettings from "../pages/ProfileSettings";

export interface AppRoute {
  path: string;
  element: ComponentType;
}

export const PublicRoutes: AppRoute[] = [
  { path: "/", element: Blogs },
  { path: "/blog/:id", element: Blog },
];

export const ProtectedRoutes = [
  { path: "/blog-edit", element: EditProfile },
  { path: "/create_post", element: CreatePost },
  { path: "/profile/:id", element: Profile },
  { path: "/profile-edit", element: EditProfile },
  { path: "/profile-settings", element: ProfileSettings },
];

export const AuthRoutes: AppRoute[] = [
  { path: "/signup", element: SignUp },
  { path: "/signin", element: SignIn },
];
