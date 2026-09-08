import { createBrowserTestConfig } from "./vitest.browser.config";

export default createBrowserTestConfig({
  apiPort: 51_101,
  include: ["src/components/SidebarActivityView.browser.tsx"],
  providerOptions: {
    contextOptions: { hasTouch: true },
  },
});
