import test from "node:test";
import assert from "node:assert";
import app from "../app";

test("Server khởi tạo thành công và trả về 200 ở root endpoint", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    const response = await fetch(base);
    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.success, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("Ghi chú kiểm thử", () => {
  console.log("\n--- LƯU Ý ---");
  console.log("Đây chỉ là bài test môi trường chạy local cơ bản.");
  console.log("Bài nộp qua Pull Request sẽ được chấm riêng.");
  console.log("-----------\n");
});
