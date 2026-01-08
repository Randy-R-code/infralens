"use server";

import { runChecks } from "@/lib/checks";
import { ChecksResponse } from "@/lib/checks/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfConnectingIp = headersList.get("cf-connecting-ip");

  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    "unknown";

  return ip;
}

export async function runInfraChecks(
  inputUrl: string
): Promise<ChecksResponse> {
  // Rate limiting
  const identifier = await getClientIdentifier();
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.allowed) {
    throw new Error(
      `Rate limit exceeded. Please wait ${Math.ceil(
        (rateLimit.resetAt - Date.now()) / 1000
      )} seconds before trying again.`
    );
  }

  const url = new URL(inputUrl);

  const response = await runChecks({
    url: url.toString(),
    hostname: url.hostname,
    timeout: 8000,
  });

  return response;
}
