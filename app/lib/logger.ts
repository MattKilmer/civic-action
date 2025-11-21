/**
 * Simple usage logging utility
 * Logs key user actions to console for monitoring and analytics
 *
 * In production, these logs can be ingested by:
 * - Vercel Logs (built-in)
 * - Datadog, New Relic, etc.
 * - Custom log aggregation service
 *
 * Also feeds data to PostgreSQL database for persistent analytics.
 */

import * as analyticsDB from "./analyticsDB";

type LogLevel = "info" | "warn" | "error";

interface LogEvent {
  timestamp: string;
  level: LogLevel;
  event: string;
  data?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

/**
 * Log a user action or system event
 */
export function logEvent(
  event: string,
  data?: Record<string, any>,
  level: LogLevel = "info",
  context?: { ip?: string; userAgent?: string }
) {
  const logEntry: LogEvent = {
    timestamp: new Date().toISOString(),
    level,
    event,
    data,
    ip: context?.ip,
    userAgent: context?.userAgent,
  };

  // Log to console (captured by Vercel/hosting platform)
  const logMessage = `[${logEntry.level.toUpperCase()}] ${logEntry.event}`;

  switch (level) {
    case "error":
      console.error(logMessage, logEntry);
      break;
    case "warn":
      console.warn(logMessage, logEntry);
      break;
    default:
      console.log(logMessage, logEntry);
  }

  // Future: Send to analytics service (Plausible, Mixpanel, etc.)
  // Future: Send to log aggregation (Datadog, LogRocket, etc.)
}

/**
 * Log user address lookup
 */
export function logAddressLookup(params: {
  address: string;
  officialsFound: number;
  state?: string;
  ip?: string;
  userAgent?: string;
}) {
  logEvent(
    "address_lookup",
    {
      // Hash the address for privacy
      addressHash: hashString(params.address),
      officialsFound: params.officialsFound,
      state: params.state,
    },
    "info",
    { ip: params.ip, userAgent: params.userAgent }
  );

  // Feed to database analytics
  if (params.ip) {
    analyticsDB.trackAddressLookup(params.ip, params.state).catch(err =>
      console.error("Failed to track address lookup in DB:", err)
    );
  }
}

/**
 * Log bill search
 */
export function logBillSearch(params: {
  query: string;
  billType: "federal" | "state";
  jurisdiction?: string;
  resultsCount: number;
  ip?: string;
  userAgent?: string;
}) {
  logEvent(
    "bill_search",
    {
      query: params.query.substring(0, 50), // Limit query length
      billType: params.billType,
      jurisdiction: params.jurisdiction,
      resultsCount: params.resultsCount,
    },
    "info",
    { ip: params.ip, userAgent: params.userAgent }
  );

  // Feed to database analytics
  if (params.ip) {
    analyticsDB.trackBillSearch(
      params.ip,
      params.query,
      params.billType,
      params.jurisdiction
    ).catch(err =>
      console.error("Failed to track bill search in DB:", err)
    );
  }
}

/**
 * Log email draft generation
 */
export function logEmailDraft(params: {
  topic: string;
  stance: "support" | "oppose";
  billNumber?: string;
  officialRole: string;
  wordCount: number;
  ip?: string;
  userAgent?: string;
}) {
  logEvent(
    "email_draft",
    {
      topic: params.topic,
      stance: params.stance,
      billNumber: params.billNumber,
      officialRole: params.officialRole,
      wordCount: params.wordCount,
    },
    "info",
    { ip: params.ip, userAgent: params.userAgent }
  );

  // Feed to database analytics
  if (params.ip) {
    analyticsDB.trackEmailDraft(params.ip, params.topic).catch(err =>
      console.error("Failed to track email draft in DB:", err)
    );
  }
}

/**
 * Log API errors
 */
export function logAPIError(params: {
  endpoint: string;
  error: string;
  statusCode?: number;
  ip?: string;
  userAgent?: string;
}) {
  logEvent(
    "api_error",
    {
      endpoint: params.endpoint,
      error: params.error,
      statusCode: params.statusCode,
    },
    "error",
    { ip: params.ip, userAgent: params.userAgent }
  );

  // Feed to database analytics
  if (params.ip) {
    const isRateLimit = params.statusCode === 429 || params.error.toLowerCase().includes("rate limit");

    if (isRateLimit) {
      analyticsDB.trackRateLimitViolation(params.ip, params.endpoint).catch(err =>
        console.error("Failed to track rate limit violation in DB:", err)
      );
    }

    analyticsDB.trackAPIError(params.endpoint, params.error, params.ip).catch(err =>
      console.error("Failed to track API error in DB:", err)
    );
  }
}

/**
 * Simple string hash for privacy (non-cryptographic)
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
