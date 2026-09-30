import { Elysia } from "elysia";
import { routes } from "@/routes";
import { healthRoutes } from "@/routes/health";
import { buildErrorResponse } from "@/utils/errors";
import { logger } from "@/utils/logger";

/**
 * Приложение без listen() — чтобы тесты могли работать in-process
 * через app.handle(new Request(...)).
 *
 * 404 в Elysia 1.4 приходит через onError c code === "NOT_FOUND".
 */
export const app = new Elysia({ name: "app" })
  .use(logger)
  .use([healthRoutes, routes])
  .onError(({ request, code, error, set }) => {
    const response = buildErrorResponse(code, error);
    set.status = response.status;

    if (code === "NOT_FOUND") {
      const { pathname } = new URL(request.url);
      response.body.error.message = `${request.method} ${pathname} not found`;
    }

    return response.body;
  });
