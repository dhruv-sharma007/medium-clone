import "dotenv/config";
import { Hono } from "hono";
import userRoute from "./routes/user.route";
import blogRouter from "./routes/blog.route";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  }),
);

app.get("/", (c) => {
  return c.text("yamdoot world", 200);
});

app.route("/api/v1/user", userRoute);
app.route("/api/v1/blog", blogRouter);

Bun.serve({
  port: 8787,
  fetch: app.fetch,
  hostname: "0.0.0.0"
});
console.log(`🚀 Server running at http://localhost:${8787}`);
