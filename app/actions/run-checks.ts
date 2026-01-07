"use server";

import { runChecks } from "@/lib/checks";

export async function runInfraChecks(inputUrl: string) {
  const url = new URL(inputUrl);

  const response = await runChecks({
    url: url.toString(),
    hostname: url.hostname,
    timeout: 8000,
  });

  return response.checks;
}
