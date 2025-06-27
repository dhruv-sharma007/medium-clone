import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const userAuth = async (c: Context, next: Next) => {
  const token = getCookie(c, "token");

  if (!token) {
    return c.json({ message: "Unauthorized - No token" }, 403);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET, "HS256") as {
      id: number;
      name: string;
      username: string;
    };

    c.set("user", {
      id: payload.id,
      name: payload.name,
      username: payload.username,
    });

    return await next();
  } catch (err) {
    return c.json({ message: "Unauthorized - Invalid token" }, 403);
  }
};
