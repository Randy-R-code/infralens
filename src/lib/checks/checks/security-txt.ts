import { CheckRunner } from "../types";

export const runSecurityTxtCheck: CheckRunner<{
  present: boolean;
  location?: string;
  hasContact: boolean;
  hasExpires: boolean;
  fields: string[];
}> = async ({ url, timeout }) => {
  const start = performance.now();

  try {
    const urlObj = new URL(url);
    const locations = [
      `${urlObj.origin}/.well-known/security.txt`,
      `${urlObj.origin}/security.txt`,
    ];

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      let foundLocation: string | undefined;
      let content: string | undefined;
      let status = 404;

      // Try both locations
      for (const loc of locations) {
        try {
          const response = await fetch(loc, {
            method: "GET",
            signal: controller.signal,
          });
          if (response.status === 200) {
            content = await response.text();
            // Verify it's actually a security.txt (contains Contact field)
            if (content.toLowerCase().includes("contact:")) {
              foundLocation = loc;
              status = 200;
              break;
            }
          }
        } catch {
          continue;
        }
      }

      clearTimeout(id);

      const present = status === 200 && !!content;
      const hasContact = content?.toLowerCase().includes("contact:") ?? false;
      const hasExpires = content?.toLowerCase().includes("expires:") ?? false;

      // Extract field names
      const fields: string[] = [];
      if (content) {
        const lines = content.split("\n");
        for (const line of lines) {
          const match = line.match(/^([A-Za-z-]+):/);
          if (match && !fields.includes(match[1])) {
            fields.push(match[1]);
          }
        }
      }

      let checkStatus: "ok" | "warning" | "error" = "ok";
      let summary = "";

      if (!present) {
        checkStatus = "warning";
        summary =
          "security.txt not found. Consider adding one for security researchers.";
      } else if (!hasExpires) {
        checkStatus = "warning";
        summary =
          "security.txt found but missing Expires field (required by RFC 9116).";
      } else {
        summary = `security.txt found with ${fields.length} fields.`;
      }

      return {
        id: "security-txt",
        label: "security.txt",
        category: "http-security",
        status: checkStatus,
        summary,
        data: {
          present,
          location: foundLocation,
          hasContact,
          hasExpires,
          fields,
        },
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      return {
        id: "security-txt",
        label: "security.txt",
        category: "http-security",
        status: "warning",
        summary: "Unable to fetch security.txt.",
        data: {
          present: false,
          hasContact: false,
          hasExpires: false,
          fields: [],
        },
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "security-txt",
      label: "security.txt",
      category: "http-security",
      status: "error",
      summary: "Unable to check security.txt.",
      data: {
        present: false,
        hasContact: false,
        hasExpires: false,
        fields: [],
      },
      durationMs: Math.round(performance.now() - start),
    };
  }
};
