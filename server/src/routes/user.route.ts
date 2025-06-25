import { deleteProfile, getProfile, userSignin, userSignOut, userSignUp } from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth.mid";
import { Hono } from "hono";

type Variables = {
  user: { id: number; name: string; username: string };
};

const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: Variables;
}>();

user.post("/signup", userSignUp);
user.post("/signin", userSignin);
user.get("/signout", userSignOut);
user.get('/me', userAuth, getProfile)
user.delete('/me', userAuth, deleteProfile)

export default user;
