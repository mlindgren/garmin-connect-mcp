/**
 * Integration test suite for garmin-connect-mcp.
 * Tests the actual MCP tool handlers (not just raw API endpoints)
 * to catch bugs in zip extraction, file I/O, date defaults, etc.
 *
 * Requires a valid session at ~/.garmin-connect-mcp/session.json.
 * Run: npm test
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools.js";
import { existsSync, rmSync, mkdirSync } from "node:fs";
import { getSharedClient } from "./garmin-client.js";

const TEST_FIT_DIR = "/tmp/garmin-mcp-test-fit";

interface ToolResult {
  content: { type: string; text: string }[];
  isError?: boolean;
}

async function callTool(
  server: McpServer,
  name: string,
  args: Record<string, unknown> = {}
): Promise<ToolResult> {
  // Access internal tool handler via the server's registered tools
  const result = (await (server as any)._registeredTools[name].handler(
    { ...args },
    { signal: new AbortController().signal }
  )) as ToolResult;
  return result;
}

function getToolText(result: ToolResult): string {
  return result.content[0]?.text ?? "";
}

function getToolJson(result: ToolResult): unknown {
  return JSON.parse(getToolText(result));
}

interface TestCase {
  name: string;
  run: (server: McpServer) => Promise<void>;
}

const tests: TestCase[] = [
  // ── Session ────────────────────────────────────────────────────────
  {
    name: "check-session",
    run: async (server) => {
      const result = await callTool(server, "check-session");
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as { status: string };
      if (data.status !== "ok") throw new Error("status not ok");
    },
  },
  {
    name: "get-user-profile",
    run: async (server) => {
      const result = await callTool(server, "get-user-profile");
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as { id: number };
      if (!data.id) throw new Error("no user id");
    },
  },

  // ── Activities ─────────────────────────────────────────────────────
  {
    name: "list-activities",
    run: async (server) => {
      const result = await callTool(server, "list-activities", {
        limit: 2,
        start: 0,
      });
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as unknown[];
      if (!Array.isArray(data) || data.length === 0)
        throw new Error("no activities");
    },
  },
  {
    name: "get-activity",
    run: async (server) => {
      const result = await callTool(server, "get-activity", {
        activityId: activityId!,
      });
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as { summaryDTO?: unknown };
      if (!data.summaryDTO) throw new Error("no summaryDTO");
    },
  },
  {
    name: "get-activity-details",
    run: async (server) => {
      const result = await callTool(server, "get-activity-details", {
        activityId: activityId!,
        maxChartSize: 10000,
      });
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as { metricDescriptors?: unknown[] };
      if (!data.metricDescriptors) throw new Error("no metricDescriptors");
    },
  },
  {
    name: "get-activity-splits",
    run: async (server) => {
      const result = await callTool(server, "get-activity-splits", {
        activityId: activityId!,
      });
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as { lapDTOs?: unknown[] };
      if (!data.lapDTOs) throw new Error("no lapDTOs");
    },
  },
  {
    name: "get-activity-hr-zones",
    run: async (server) => {
      const result = await callTool(server, "get-activity-hr-zones", {
        activityId: activityId!,
      });
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as unknown[];
      if (!Array.isArray(data) || data.length !== 5)
        throw new Error(`expected 5 zones, got ${data.length}`);
    },
  },
  {
    name: "get-activity-polyline",
    run: async (server) => {
      const result = await callTool(server, "get-activity-polyline", {
        activityId: activityId!,
      });
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-activity-weather",
    run: async (server) => {
      const result = await callTool(server, "get-activity-weather", {
        activityId: activityId!,
      });
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "download-fit (zip extraction + file write)",
    run: async (server) => {
      // Clean up from previous runs
      if (existsSync(TEST_FIT_DIR)) rmSync(TEST_FIT_DIR, { recursive: true });
      const result = await callTool(server, "download-fit", {
        activityId: activityId!,
        outputDir: TEST_FIT_DIR,
      });
      if (result.isError) throw new Error(getToolText(result));
      const text = getToolText(result);
      if (!text.includes("Downloaded FIT file"))
        throw new Error(`unexpected response: ${text}`);
      // Verify file actually exists on disk
      const expectedPath = `${TEST_FIT_DIR}/${activityId}.fit`;
      if (!existsSync(expectedPath))
        throw new Error(`FIT file not found at ${expectedPath}`);
    },
  },

  // ── Daily Health (test date defaults) ──────────────────────────────
  {
    name: "get-daily-summary (default date)",
    run: async (server) => {
      const result = await callTool(server, "get-daily-summary");
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as { calendarDate?: string };
      if (!data.calendarDate) throw new Error("no calendarDate");
    },
  },
  {
    name: "get-daily-heart-rate",
    run: async (server) => {
      const result = await callTool(server, "get-daily-heart-rate");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-daily-stress",
    run: async (server) => {
      const result = await callTool(server, "get-daily-stress");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-daily-summary-chart",
    run: async (server) => {
      const result = await callTool(server, "get-daily-summary-chart");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-daily-intensity-minutes",
    run: async (server) => {
      const result = await callTool(server, "get-daily-intensity-minutes");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-daily-movement",
    run: async (server) => {
      const result = await callTool(server, "get-daily-movement");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-daily-respiration",
    run: async (server) => {
      const result = await callTool(server, "get-daily-respiration");
      if (result.isError) throw new Error(getToolText(result));
    },
  },

  // ── Sleep / Body Battery / HRV ─────────────────────────────────────
  {
    name: "get-sleep",
    run: async (server) => {
      const result = await callTool(server, "get-sleep");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-body-battery",
    run: async (server) => {
      const result = await callTool(server, "get-body-battery");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-hrv",
    run: async (server) => {
      const result = await callTool(server, "get-hrv");
      if (result.isError) throw new Error(getToolText(result));
      // noData is acceptable
    },
  },

  // ── Weight / Records / Fitness ─────────────────────────────────────
  {
    name: "get-weight",
    run: async (server) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
        .toISOString()
        .slice(0, 10);
      const today = new Date().toISOString().slice(0, 10);
      const result = await callTool(server, "get-weight", {
        startDate: thirtyDaysAgo,
        endDate: today,
      });
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-personal-records (displayName resolution)",
    run: async (server) => {
      const result = await callTool(server, "get-personal-records");
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as unknown[];
      if (!Array.isArray(data)) throw new Error("expected array");
    },
  },
  {
    name: "get-fitness-stats",
    run: async (server) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
        .toISOString()
        .slice(0, 10);
      const today = new Date().toISOString().slice(0, 10);
      const result = await callTool(server, "get-fitness-stats", {
        startDate: thirtyDaysAgo,
        endDate: today,
        aggregation: "daily",
        metric: "duration",
      });
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-vo2max",
    run: async (server) => {
      const result = await callTool(server, "get-vo2max");
      if (result.isError) throw new Error(getToolText(result));
    },
  },
  {
    name: "get-hr-zones-config",
    run: async (server) => {
      const result = await callTool(server, "get-hr-zones-config");
      if (result.isError) throw new Error(getToolText(result));
      const data = getToolJson(result) as unknown[];
      if (!Array.isArray(data) || data.length === 0)
        throw new Error("no zones returned");
    },
  },
];

// Resolved during bootstrap
let activityId: string;

async function main() {
  console.log("garmin-connect-mcp integration tests (tool-level)\n");

  // Set up a real MCP server with all tools registered
  const server = new McpServer({
    name: "garmin-connect-mcp-test",
    version: "0.0.0",
  });
  registerTools(server);

  // Bootstrap: get a recent activityId
  console.log("Bootstrapping...");
  const listResult = await callTool(server, "list-activities", {
    limit: 1,
    start: 0,
  });
  const activities = getToolJson(listResult) as { activityId: number }[];
  activityId = String(activities[0]?.activityId ?? "");
  if (!activityId) {
    console.error("FATAL: No activities found");
    process.exit(1);
  }
  console.log(`  activityId: ${activityId}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const start = Date.now();
    try {
      await test.run(server);
      const ms = Date.now() - start;
      console.log(`  PASS  ${test.name} (${ms}ms)`);
      passed++;
    } catch (e) {
      const ms = Date.now() - start;
      const msg = e instanceof Error ? e.message : String(e);
      const short = msg.length > 120 ? msg.slice(0, 120) + "..." : msg;
      console.log(`  FAIL  ${test.name} (${ms}ms) — ${short}`);
      failed++;
    }
  }

  // Cleanup
  if (existsSync(TEST_FIT_DIR)) rmSync(TEST_FIT_DIR, { recursive: true });

  console.log(
    `\nResults: ${passed} passed, ${failed} failed, ${passed + failed} total`
  );
  await getSharedClient().close();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
