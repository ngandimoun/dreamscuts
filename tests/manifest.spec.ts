// tests/manifest.spec.ts
import { ProductionManifestZ } from "../validators/production-manifest";
import example from "../examples/manifest-example.json";
import { runBusinessChecks } from "../services/manifestService";

test("zod validation passes for example", () => {
  const parse = ProductionManifestZ.safeParse(example);
  expect(parse.success).toBe(true);
});

test("business checks produce no blocking errors for example when jobs present", () => {
  const errs = runBusinessChecks(example as any);
  expect(errs.length).toBe(0);
});

test("duration mismatch fails", () => {
  const bad = JSON.parse(JSON.stringify(example));
  bad.metadata.durationSeconds = 10;
  const errs = runBusinessChecks(bad);
  expect(errs.some(e => e.code === "DURATION_MISMATCH")).toBe(true);
});
