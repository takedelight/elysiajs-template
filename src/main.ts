import { Elysia } from "elysia";
import "./utils/env/env.schema";
import { env } from "./utils/env/env.schema";

const app = new Elysia().get("/", () => "Hello Elysia").listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} [${env.NODE_ENV}]`,
);
