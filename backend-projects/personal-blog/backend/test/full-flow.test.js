import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";

const PORT = 3101;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const ADMIN_USERNAME = "test_admin";
const ADMIN_PASSWORD = "test_password";
const TEST_DB_FILE = "articles.test.json";

const dbFileUrl = new URL(`../db/${TEST_DB_FILE}`, import.meta.url);
const serverCwdUrl = new URL("../", import.meta.url);

let serverProcess;
let originalDbContent;
let testDbExisted = false;

const authHeader = () => {
  const token = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString(
    "base64",
  );
  return `Basic ${token}`;
};

const waitForServer = async (timeoutMs = 10000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok || response.status === 401) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error("Server did not become ready in time.");
};

const startServer = async () => {
  serverProcess = spawn(process.execPath, ["server.js"], {
    cwd: serverCwdUrl,
    env: {
      ...process.env,
      PORT: String(PORT),
      ADMIN_USERNAME,
      ADMIN_PASSWORD,
      DB_FILE: TEST_DB_FILE,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForServer();
};

const stopServer = async () => {
  if (!serverProcess || serverProcess.killed) {
    return;
  }

  await new Promise((resolve) => {
    serverProcess.once("exit", () => resolve());
    serverProcess.kill("SIGTERM");

    setTimeout(() => {
      if (!serverProcess.killed) {
        serverProcess.kill("SIGKILL");
      }
    }, 3000);
  });
};

before(async () => {
  try {
    originalDbContent = await fs.readFile(dbFileUrl, "utf-8");
    testDbExisted = true;
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    originalDbContent = "[]";
    testDbExisted = false;
  }

  await fs.writeFile(dbFileUrl, "[]", "utf-8");
  await startServer();
});

after(async () => {
  await stopServer();

  if (testDbExisted) {
    await fs.writeFile(dbFileUrl, originalDbContent, "utf-8");
  } else {
    await fs.unlink(dbFileUrl).catch(() => {});
  }
});

test("full blog API flow: guest list -> admin create/get/edit/delete", async () => {
  const initialRes = await fetch(`${BASE_URL}/`);
  assert.equal(initialRes.status, 200);
  const initialBody = await initialRes.json();
  assert.equal(initialBody.status, "success");
  assert.deepEqual(initialBody.guestArticles, []);

  const unauthorizedAdminGetRes = await fetch(`${BASE_URL}/admin/`);
  assert.equal(unauthorizedAdminGetRes.status, 401);

  const unauthorizedCreateRes = await fetch(`${BASE_URL}/admin/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Unauthorized", content: "Should fail" }),
  });
  assert.equal(unauthorizedCreateRes.status, 401);

  const createRes = await fetch(`${BASE_URL}/admin/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({ title: "First Post", content: "Hello world" }),
  });

  assert.equal(createRes.status, 201);
  const createBody = await createRes.json();
  assert.equal(createBody.status, "success");
  assert.equal(createBody.data.id, 1);

  const guestAfterCreateRes = await fetch(`${BASE_URL}/`);
  assert.equal(guestAfterCreateRes.status, 200);
  const guestAfterCreateBody = await guestAfterCreateRes.json();
  assert.equal(guestAfterCreateBody.status, "success");
  assert.equal(guestAfterCreateBody.guestArticles.length, 1);
  assert.deepEqual(guestAfterCreateBody.guestArticles[0], {
    id: 1,
    title: "First Post",
    content: "Hello world",
  });

  const authorizedAdminGetRes = await fetch(`${BASE_URL}/admin/`, {
    headers: { Authorization: authHeader() },
  });
  assert.equal(authorizedAdminGetRes.status, 200);
  const authorizedAdminGetBody = await authorizedAdminGetRes.json();
  assert.equal(authorizedAdminGetBody.status, "success");
  assert.equal(authorizedAdminGetBody.articles.length, 1);

  const editRes = await fetch(`${BASE_URL}/admin/edit/1`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({ title: "Updated Post", content: "Updated content" }),
  });

  assert.equal(editRes.status, 200);
  const editBody = await editRes.json();
  assert.equal(editBody.status, "success");
  assert.equal(editBody.data.title, "Updated Post");
  assert.equal(editBody.data.content, "Updated content");

  const deleteRes = await fetch(`${BASE_URL}/admin/delete/1`, {
    method: "DELETE",
    headers: { Authorization: authHeader() },
  });

  assert.equal(deleteRes.status, 200);
  const deleteBody = await deleteRes.json();
  assert.equal(deleteBody.status, "success");

  const finalRes = await fetch(`${BASE_URL}/`);
  assert.equal(finalRes.status, 200);
  const finalBody = await finalRes.json();
  assert.equal(finalBody.status, "success");
  assert.deepEqual(finalBody.guestArticles, []);
});
