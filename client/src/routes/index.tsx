import type { ComponentType } from "react";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Blogs from "../pages/Blogs";
import Blog from "../pages/Blog";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import ProfileSettings from "../pages/ProfileSettings";
import SearchPage from "../pages/SearchPage";
import NotFound from "../pages/NotFound";

export interface AppRoute {
  path: string;
  element: ComponentType;
}

export const PublicRoutes: AppRoute[] = [
  { path: "/", element: Blogs },
  { path: "/blog/:id", element: Blog },
  { path: "*", element: NotFound },
];

export const ProtectedRoutes = [
  // { path: "/blog-edit", element: EditProfile },
  { path: "/create-post", element: CreatePost },
  { path: "/profile/:username", element: Profile },
  { path: "/profile-edit", element: EditProfile },
  { path: "/profile-settings", element: ProfileSettings },
  { path: "/search", element: SearchPage },
];

export const AuthRoutes: AppRoute[] = [
  { path: "/signup", element: SignUp },
  { path: "/signin", element: SignIn },
];
