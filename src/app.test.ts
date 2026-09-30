import { describe, expect, test } from "bun:test";
import { app } from "@/app";

const call = async (path: string) => {
  const response = await app.handle(new Request(`http://localhost${path}`));
  const body: unknown = await response.json();
  return { status: response.status, body };
};

describe("GET /", () => {
  test("отдаёт имя сервиса и статус — контракт для клиентов шаблона", async () => {
    const { status, body } = await call("/");
    expect(status).toBe(200);
    expect(body).toEqual({ name: "elysia-template", status: "ok" });
  });
});

describe("GET /api/v1/hello", () => {
  test("без query использует имя по умолчанию", async () => {
    const { status, body } = await call("/api/v1/hello");
    expect(status).toBe(200);
    expect(body).toEqual({ hello: "world" });
  });

  test("возвращает переданное имя", async () => {
    const { status, body } = await call("/api/v1/hello?name=nikol");
    expect(status).toBe(200);
    expect(body).toEqual({ hello: "nikol" });
  });

  test("пустое имя невалидно — защита от битых данных на входе", async () => {
    const { status, body } = await call("/api/v1/hello?name=");
    expect(status).toBe(422);
    expect(body).toMatchObject({ error: { code: "VALIDATION" } });
  });
});

describe("обработка ошибок", () => {
  test("неизвестный маршрут → 404 в едином формате", async () => {
    const { status, body } = await call("/definitely-missing");
    expect(status).toBe(404);
    expect(body).toEqual({
      error: { code: "NOT_FOUND", message: "GET /definitely-missing not found" },
    });
  });
});

describe("GET /health", () => {
  test("статус согласован с состоянием базы: up ⇔ 200, down ⇔ 503", async () => {
    const { status, body } = await call("/health");
    const health = body as { status: string; database: string; uptime: number };

    expect(["ok", "degraded"]).toContain(health.status);
    if (health.database === "up") {
      expect(status).toBe(200);
      expect(health.status).toBe("ok");
    } else {
      expect(status).toBe(503);
      expect(health.status).toBe("degraded");
    }
    expect(health.uptime).toBeGreaterThanOrEqual(0);
  });
});
