import { runHeadersCheck } from "./checks/headers";
import { CheckContext, CheckRunner, ChecksResponse } from "./types";

const CHECKS: CheckRunner[] = [runHeadersCheck];

export async function runChecks(
  context: CheckContext
): Promise<ChecksResponse> {
  const start = performance.now();

  const results = await Promise.all(
    CHECKS.map(async (check) => {
      return check(context);
    })
  );

  return {
    url: context.url,
    hostname: context.hostname,
    checks: results,
    totalDurationMs: Math.round(performance.now() - start),
  };
}
