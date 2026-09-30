import { Elysia, t } from "elysia";

/**
 * Корневые роуты + версионированная группа /api/v1.
 * Добавляйте новые endpoint'ы внутри group, чтобы не ломать клиентов при bump'е версии.
 */
export const routes = new Elysia({ name: "routes" })
  .get("/", () => ({ name: "elysia-template", status: "ok" }))
  .group("/api/v1", (api) =>
    api
      .get("/ping", () => ({ pong: true, time: new Date().toISOString() }))
      // Пример валидации входящих данных через Typebox (t)
      .get("/hello", ({ query }) => ({ hello: query.name ?? "world" }), {
        query: t.Object({
          name: t.Optional(t.String({ minLength: 1 })),
        }),
      }),
  );
