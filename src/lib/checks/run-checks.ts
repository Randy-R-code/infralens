import { calculateGlobalScore } from "./calculate-score";
import { runAccessibilityCheck } from "./checks/accessibility";
import { runDnsRecordsCheck } from "./checks/dns-records";
import { runDnsSecurityCheck } from "./checks/dns-security";
import { runHeadersCheck } from "./checks/headers";
import { runHttpsCheck } from "./checks/https";
import { runIpHostingCheck } from "./checks/ip-hosting";
import { runLinksCheck } from "./checks/links";
import { runMetadataCheck } from "./checks/metadata";
import { runPerformanceCheck } from "./checks/performance";
import { runRedirectsCheck } from "./checks/redirects";
import { runRobotsCheck } from "./checks/robots";
import { runSecurityTxtCheck } from "./checks/security-txt";
import { runServerHeadersCheck } from "./checks/server-headers";
import { runSitemapCheck } from "./checks/sitemap";
import { runSocialCheck } from "./checks/social";
import { runStackCheck } from "./checks/stack";
import { runUptimeCheck } from "./checks/uptime";
import { runWafCheck } from "./checks/waf";
import { CheckContext, CheckRunner, ChecksResponse } from "./types";

const CHECKS: CheckRunner[] = [
  runHeadersCheck,
  runHttpsCheck,
  runSecurityTxtCheck,
  runRedirectsCheck,
  runDnsRecordsCheck,
  runDnsSecurityCheck,
  runIpHostingCheck,
  runRobotsCheck,
  runSitemapCheck,
  runLinksCheck,
  runMetadataCheck,
  runAccessibilityCheck,
  runPerformanceCheck,
  runServerHeadersCheck,
  runSocialCheck,
  runStackCheck,
  runWafCheck,
  runUptimeCheck,
];

export async function runChecks(
  context: CheckContext
): Promise<ChecksResponse> {
  const start = performance.now();

  const results = await Promise.all(
    CHECKS.map(async (check) => {
      return check(context);
    })
  );

  const totalDurationMs = Math.round(performance.now() - start);
  const score = calculateGlobalScore(results);

  return {
    url: context.url,
    hostname: context.hostname,
    checks: results,
    totalDurationMs,
    score,
  };
}
