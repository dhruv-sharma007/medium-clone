import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const userAuth =  async (c: Context, next: Next) => {
  const token = getCookie(c, "token");
  
  const isVerified: any = await verify(
    String(token),
    String(c.env.JWT_SECRET),
    "HS256",
  );

  if (typeof isVerified === "object" && isVerified !== null) {
    c.set("user", {
      id: isVerified.id,
      name: isVerified.name,
      username: isVerified.username,
    });
  } else {
    return c.json({ message: "Unauthorized" }, 401);
  }
  return await next();
}
