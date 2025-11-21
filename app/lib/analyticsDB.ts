/**
 * Database-Backed Analytics Service
 * Replaces in-memory analytics with persistent PostgreSQL storage
 */

import { sql } from "./db";
import crypto from "crypto";

/**
 * Hash IP address for privacy (one-way, irreversible)
 */
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

/**
 * Track address lookup
 */
export async function trackAddressLookup(ip: string, state?: string) {
  try {
    await sql`
      INSERT INTO analytics_events (event_type, ip_hash, state)
      VALUES ('address_lookup', ${hashIP(ip)}, ${state || null})
    `;
  } catch (error) {
    console.error("Failed to track address lookup:", error);
  }
}

/**
 * Track bill search
 */
export async function trackBillSearch(
  ip: string,
  query: string,
  billType: "federal" | "state",
  jurisdiction?: string
) {
  try {
    await sql`
      INSERT INTO analytics_events (event_type, ip_hash, query, bill_type, jurisdiction)
      VALUES ('bill_search', ${hashIP(ip)}, ${query}, ${billType}, ${jurisdiction || null})
    `;
  } catch (error) {
    console.error("Failed to track bill search:", error);
  }
}

/**
 * Track email draft generation
 */
export async function trackEmailDraft(ip: string, topic: string) {
  try {
    await sql`
      INSERT INTO analytics_events (event_type, ip_hash, topic)
      VALUES ('email_draft', ${hashIP(ip)}, ${topic})
    `;
  } catch (error) {
    console.error("Failed to track email draft:", error);
  }
}

/**
 * Track API error
 */
export async function trackAPIError(
  endpoint: string,
  errorMessage: string,
  ip?: string
) {
  try {
    await sql`
      INSERT INTO analytics_events (event_type, endpoint, error_message, ip_hash)
      VALUES ('api_error', ${endpoint}, ${errorMessage}, ${ip ? hashIP(ip) : null})
    `;
  } catch (error) {
    console.error("Failed to track API error:", error);
  }
}

/**
 * Track rate limit violation
 */
export async function trackRateLimitViolation(ip: string, endpoint: string) {
  try {
    await sql`
      INSERT INTO rate_limit_violations (ip_hash, endpoint)
      VALUES (${hashIP(ip)}, ${endpoint})
    `;
  } catch (error) {
    console.error("Failed to track rate limit violation:", error);
  }
}

/**
 * Get analytics snapshot for admin dashboard
 */
export async function getAnalyticsSnapshot() {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total counts (all time)
    const [totals] = await sql`
      SELECT
        COUNT(CASE WHEN event_type = 'address_lookup' THEN 1 END) as total_address_lookups,
        COUNT(CASE WHEN event_type = 'bill_search' THEN 1 END) as total_bill_searches,
        COUNT(CASE WHEN event_type = 'email_draft' THEN 1 END) as total_email_drafts,
        COUNT(CASE WHEN event_type = 'api_error' THEN 1 END) as total_api_errors
      FROM analytics_events
    `;

    // Last 24 hours counts
    const [last24h] = await sql`
      SELECT
        COUNT(CASE WHEN event_type = 'address_lookup' THEN 1 END) as lookups_24h,
        COUNT(CASE WHEN event_type = 'bill_search' THEN 1 END) as searches_24h,
        COUNT(CASE WHEN event_type = 'email_draft' THEN 1 END) as drafts_24h,
        COUNT(CASE WHEN event_type = 'api_error' THEN 1 END) as errors_24h
      FROM analytics_events
      WHERE timestamp >= ${oneDayAgo.toISOString()}
    `;

    // Unique users (last 24h)
    const [uniqueUsers] = await sql`
      SELECT COUNT(DISTINCT ip_hash) as unique_users_24h
      FROM analytics_events
      WHERE timestamp >= ${oneDayAgo.toISOString()}
        AND ip_hash IS NOT NULL
    `;

    // Bill searches by type
    const [billSearches] = await sql`
      SELECT
        COUNT(CASE WHEN bill_type = 'federal' THEN 1 END) as federal_searches,
        COUNT(CASE WHEN bill_type = 'state' THEN 1 END) as state_searches
      FROM analytics_events
      WHERE event_type = 'bill_search'
    `;

    // Top bill searches (last 7 days)
    const topBillSearches = await sql`
      SELECT query, COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'bill_search'
        AND timestamp >= ${oneWeekAgo.toISOString()}
        AND query IS NOT NULL
      GROUP BY query
      ORDER BY count DESC
      LIMIT 10
    `;

    // Top topics (last 7 days)
    const topTopics = await sql`
      SELECT topic, COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'email_draft'
        AND timestamp >= ${oneWeekAgo.toISOString()}
        AND topic IS NOT NULL
      GROUP BY topic
      ORDER BY count DESC
      LIMIT 10
    `;

    // State distribution (all time)
    const stateDistribution = await sql`
      SELECT state, COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'address_lookup'
        AND state IS NOT NULL
      GROUP BY state
      ORDER BY count DESC
      LIMIT 20
    `;

    // Errors by endpoint (last 7 days)
    const errorsByEndpoint = await sql`
      SELECT endpoint, COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'api_error'
        AND timestamp >= ${oneWeekAgo.toISOString()}
        AND endpoint IS NOT NULL
      GROUP BY endpoint
      ORDER BY count DESC
    `;

    // Rate limit violations (last 24h)
    const [rateLimits] = await sql`
      SELECT COUNT(*) as violations_24h
      FROM rate_limit_violations
      WHERE timestamp >= ${oneDayAgo.toISOString()}
    `;

    // Time series data (last 24 hours, 1-hour intervals)
    const timeSeries = await sql`
      SELECT
        DATE_TRUNC('hour', timestamp) as hour,
        COUNT(CASE WHEN event_type = 'address_lookup' THEN 1 END) as address_lookups,
        COUNT(CASE WHEN event_type = 'bill_search' THEN 1 END) as bill_searches,
        COUNT(CASE WHEN event_type = 'email_draft' THEN 1 END) as email_drafts,
        COUNT(CASE WHEN event_type = 'api_error' THEN 1 END) as errors
      FROM analytics_events
      WHERE timestamp >= ${oneDayAgo.toISOString()}
      GROUP BY hour
      ORDER BY hour ASC
    `;

    return {
      // Overall totals
      totalAddressLookups: parseInt(totals.total_address_lookups),
      totalBillSearches: parseInt(totals.total_bill_searches),
      totalEmailDrafts: parseInt(totals.total_email_drafts),
      totalAPIErrors: parseInt(totals.total_api_errors),

      // Last 24 hours
      last24Hours: {
        addressLookups: parseInt(last24h.lookups_24h),
        billSearches: parseInt(last24h.searches_24h),
        emailDrafts: parseInt(last24h.drafts_24h),
        errors: parseInt(last24h.errors_24h),
        uniqueUsers: parseInt(uniqueUsers.unique_users_24h),
      },

      // Bill search breakdown
      billSearchesByType: {
        federal: parseInt(billSearches.federal_searches),
        state: parseInt(billSearches.state_searches),
      },

      // Top items
      topBillSearches: topBillSearches.map((row: any) => ({
        query: row.query,
        count: parseInt(row.count),
      })),
      topTopics: topTopics.map((row: any) => ({
        topic: row.topic,
        count: parseInt(row.count),
      })),
      stateDistribution: stateDistribution.map((row: any) => ({
        state: row.state,
        count: parseInt(row.count),
      })),
      errorsByEndpoint: errorsByEndpoint.map((row: any) => ({
        endpoint: row.endpoint,
        count: parseInt(row.count),
      })),

      // Rate limits
      rateLimitViolations24h: parseInt(rateLimits.violations_24h),

      // Time series
      timeSeries: timeSeries.map((row: any) => ({
        timestamp: new Date(row.hour).getTime(),
        addressLookups: parseInt(row.address_lookups),
        billSearches: parseInt(row.bill_searches),
        emailDrafts: parseInt(row.email_drafts),
        errors: parseInt(row.errors),
      })),

      // Metadata
      generatedAt: now.toISOString(),
    };
  } catch (error) {
    console.error("Failed to get analytics snapshot:", error);
    throw error;
  }
}

/**
 * Reset all analytics data (admin only)
 */
export async function resetAnalytics() {
  try {
    await sql`DELETE FROM analytics_events`;
    await sql`DELETE FROM rate_limit_violations`;
    return { success: true, message: "Analytics data reset successfully" };
  } catch (error) {
    console.error("Failed to reset analytics:", error);
    return { success: false, error };
  }
}
