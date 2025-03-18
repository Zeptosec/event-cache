// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  test: false,
  typeCheck: false,
  package: {
    // package.json properties
    name: "@riposte/event-cache",
    version: Deno.args[0],
    description: "Event-emitting cache with timeout & interval expiration.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/Zeptosec/event-cache",
    },
    bugs: {
      url: "https://github.com/Zeptosec/event-cache/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
