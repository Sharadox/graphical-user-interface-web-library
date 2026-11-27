import { readdirSync } from "node:fs";
import { join } from "node:path";
import { transform } from "lightningcss";
import { compile } from "sass";
import { expect, test } from "vitest";

const SOURCE = join(process.cwd(), "source");
const sheets = readdirSync(SOURCE, { recursive: true, encoding: "utf8" }).filter((file) =>
  file.endsWith(".module.scss"),
);

// Next.js compiles CSS modules in pure mode: a selector without a local class breaks every site's build.
test.each(sheets)("%s compiles as a pure CSS module, as Next.js needs", (file) => {
  const css = compile(join(SOURCE, file), { loadPaths: [SOURCE] }).css;
  expect(() => transform({ filename: file, code: Buffer.from(css), cssModules: { pure: true } })).not.toThrow();
});

test("finds the stylesheets", () => {
  expect(sheets.length).toBeGreaterThan(5);
});
