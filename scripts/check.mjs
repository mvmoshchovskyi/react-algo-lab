import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vitest = resolve(root, "node_modules/vitest/vitest.mjs");
const outputFile = resolve(root, "public/test-results.json");

mkdirSync(dirname(outputFile), { recursive: true });

const result = spawnSync(
  process.execPath,
  [vitest, "run", "--reporter=json", "--outputFile", outputFile],
  { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

if (!existsSync(outputFile)) {
  console.error("Vitest не створив test-results.json");
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  process.exit(result.status ?? 1);
}

const report = JSON.parse(readFileSync(outputFile, "utf8"));
const files = report.testResults ?? [];

let passed = 0;
let failed = 0;

for (const file of files) {
  const assertions = file.assertionResults ?? [];
  const filePassed = assertions.filter((test) => test.status === "passed").length;
  const fileFailed = assertions.filter((test) => test.status === "failed").length;
  passed += filePassed;
  failed += fileFailed;
  const name = relative(root, file.name);
  console.log(
    `${fileFailed > 0 ? "✗" : "✓"} ${name}  ${filePassed} passed, ${fileFailed} failed`,
  );
}

console.log(`\nРазом: ${passed} passed, ${failed} failed`);
console.log(`Результати: ${relative(root, outputFile)}`);
console.log("Відкрий застосунок і натисни «Оновити статус тестів».");

if (failed > 0 || result.status !== 0) {
  process.exit(1);
}
