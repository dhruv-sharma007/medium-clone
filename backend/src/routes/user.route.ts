import { createFollow, deleteFollow, getFollowersAndFollowing } from "../controllers/follow.controller";
import {
  deleteProfile,
  editProfile,
  getAuthor,
  getTop5,
  isUsernameAvailable,
  searchUser,
  userSignin,
  userSignOut,
  userSignUp,
} from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth.mid";
import { Hono } from "hono";

type Variables = {
  user: { id: number; name: string; username: string };
};

const user = new Hono<{
  Variables: Variables;
}>();

user.post("/signup", userSignUp);
user.post("/signin", userSignin);
user.get("/signout", userSignOut);
user.delete("/me", userAuth, deleteProfile);
user.get("/username-check/:username", isUsernameAvailable);
user.post("/update-profile", userAuth, editProfile);
user.get("/getAuthor/:username", userAuth, getAuthor);

user.get("/follow/:authorId", userAuth, createFollow);
user.delete("/follow/:authorId", userAuth, deleteFollow);

user.get("/get-top5", getTop5);
user.get("/search/:name", searchUser);

user.get("/getFollowersAndFollowing/:id", getFollowersAndFollowing)

export default user;
