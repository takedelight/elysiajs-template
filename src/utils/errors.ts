/**
 * Единое преобразование ошибки Elysia в ответ API.
 * Используется и в onError приложения, и в логгере.
 */
export type ErrorResponse = {
  status: number;
  body: { error: { code: string; message: string } };
};

export const buildErrorResponse = (code: string | number, error: unknown): ErrorResponse => {
  let status = 500;
  let message = "Internal Server Error";

  if (code === "NOT_FOUND") {
    status = 404;
    message = "Not Found";
  } else if (typeof error === "object" && error !== null) {
    const e = error as { status?: unknown; valueError?: unknown; message?: unknown };

    // Elysia сама проставляет статус (422 у ValidationError и т.п.)
    if (typeof e.status === "number" && e.status >= 400 && e.status < 600) {
      status = e.status;
    }
    // У ValidationError message — это JSON-дамп, чистый текст лежит в valueError
    const valueError = e.valueError as { message?: unknown } | undefined;
    if (valueError && typeof valueError.message === "string") {
      message = valueError.message;
    } else if (typeof e.message === "string") {
      message = e.message;
    }
  }

  return { status, body: { error: { code: String(code), message } } };
};
