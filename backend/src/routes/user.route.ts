import { deleteProfile, editProfile, getProfile, isUsernameAvailable, userSignin, userSignOut, userSignUp } from "../controllers/user.controller";
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
user.get('/me', userAuth, getProfile)
user.delete('/me', userAuth, deleteProfile)
user.get('/username-check/:username', isUsernameAvailable)
user.post('/update-profile', userAuth, editProfile)

export default user;
