import { describe, expect, it } from "vitest";

import {
  SIDEBAR_ACTIVITY_ROW_POINTER_HOVER_CLASS_NAME,
  sidebarHoverRevealHideClassName,
} from "./sidebarRowStyles";

describe("Activity row interaction styles", () => {
  it("uses explicit pointer state instead of the hover media query", () => {
    const activityClasses = [
      SIDEBAR_ACTIVITY_ROW_POINTER_HOVER_CLASS_NAME,
      sidebarHoverRevealHideClassName("activity-row"),
    ].join(" ");

    expect(activityClasses).toContain("group-data-[pointer-hover=true]/activity-row");
    expect(activityClasses).not.toContain("group-hover/activity-row");
  });
});
