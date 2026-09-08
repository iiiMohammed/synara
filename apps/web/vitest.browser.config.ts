import { fileURLToPath } from "node:url";
import { playwright, type PlaywrightProviderOptions } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

const DEFAULT_BROWSER_TEST_INCLUDE = [
  "src/components/**/*.browser.tsx",
  "src/hooks/**/*.browser.ts",
  "src/hooks/**/*.browser.tsx",
  "src/lib/**/*.browser.ts",
  "src/lib/**/*.browser.tsx",
];

export function createBrowserTestConfig({
  apiPort = 51_100,
  include = DEFAULT_BROWSER_TEST_INCLUDE,
  providerOptions,
}: {
  apiPort?: number;
  include?: string[];
  providerOptions?: PlaywrightProviderOptions;
} = {}) {
  return mergeConfig(
    viteConfig,
    defineConfig({
      // Direct React roots in hook regressions must not trigger a mid-test reload.
      optimizeDeps: { include: ["react-dom/client"] },
      resolve: {
        alias: {
          "~": srcPath,
        },
      },
      test: {
        include,
        browser: {
          enabled: true,
          provider: playwright(providerOptions),
          instances: [{ browser: "chromium" }],
          headless: true,
          api: {
            // Vitest's default 63315 falls inside common Windows/Hyper-V
            // excluded-port ranges. Keep the local browser harness on IPv4 and
            // allow CI or developers to override the fallback port.
            host: process.env.VITEST_BROWSER_API_HOST ?? "127.0.0.1",
            port: Number(process.env.VITEST_BROWSER_API_PORT ?? apiPort),
          },
        },
        // The full desktop route graph can take more than 30 seconds to compile
        // on a cold Windows cache before an individual browser test can proceed.
        testTimeout: 90_000,
        hookTimeout: 90_000,
      },
    }),
  );
}

export default createBrowserTestConfig();
