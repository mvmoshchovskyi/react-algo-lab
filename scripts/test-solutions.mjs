import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exercisesDir = resolve(root, "src/exercises");
const vitest = resolve(root, "node_modules/vitest/vitest.mjs");

/** Атомарна заміна, щоб Vite HMR не прочитав напівзаписаний файл. */
function replaceFile(path, content) {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, content);
  try {
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
}

/** @type {{ path: string, original: string }[]} */
const swapped = [];

for (const entry of readdirSync(exercisesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const implPath = resolve(exercisesDir, entry.name, "impl.ts");
  const solutionPath = resolve(exercisesDir, entry.name, "solution/impl.ts");
  if (!existsSync(implPath) || !existsSync(solutionPath)) continue;

  swapped.push({ path: implPath, original: readFileSync(implPath, "utf8") });
  replaceFile(implPath, readFileSync(solutionPath, "utf8"));
}

if (swapped.length === 0) {
  console.error("Не знайдено жодного solution/impl.ts");
  process.exit(1);
}

console.log(`Тимчасово підмінено ${swapped.length} impl.ts на референсні рішення…\n`);

let status = 1;
try {
  const result = spawnSync(process.execPath, [vitest, "run"], {
    cwd: root,
    stdio: "inherit",
  });
  status = result.status ?? 1;
} finally {
  for (const { path, original } of swapped) {
    replaceFile(path, original);
  }
  console.log("\nФайли impl.ts відновлено.");
}

process.exit(status);
