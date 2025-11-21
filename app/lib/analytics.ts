/**
 * Analytics Aggregation Service
 *
 * Maintains in-memory analytics for the admin dashboard.
 * Data persists for the lifetime of the server process.
 * For production, consider migrating to Redis/Vercel KV for persistence.
 */

interface TimeSeriesEntry {
  timestamp: number;
  value: number;
}

interface AnalyticsData {
  // Overall metrics
  totalAddressLookups: number;
  totalBillSearches: number;
  totalEmailDrafts: number;
  totalAPIErrors: number;

  // Time series (last 24 hours)
  addressLookupsTimeSeries: TimeSeriesEntry[];
  billSearchesTimeSeries: TimeSeriesEntry[];
  emailDraftsTimeSeries: TimeSeriesEntry[];
  errorsTimeSeries: TimeSeriesEntry[];

  // Breakdown by type
  billSearchesByType: {
    federal: number;
    state: number;
  };

  // Top queries
  topBillSearches: Map<string, number>; // query -> count
  topTopics: Map<string, number>; // topic -> count

  // Geographic distribution (by state)
  stateDistribution: Map<string, number>; // state -> count

  // Errors by endpoint
  errorsByEndpoint: Map<string, number>; // endpoint -> count

  // Rate limiting
  rateLimitViolations: number;
  rateLimitByIP: Map<string, number>; // IP -> count

  // Unique users (approximate - based on IP hashing)
  uniqueIPs: Set<string>;

  // Hourly active users (rolling 24 hours)
  hourlyActiveUsers: Map<number, Set<string>>; // hour -> Set of IP hashes

  // Session info
  startTime: number;
  lastResetTime: number;
}

class AnalyticsAggregator {
  private data: AnalyticsData;
  private readonly MAX_TIME_SERIES_POINTS = 288; // 24 hours at 5-minute intervals
  private readonly MAX_TOP_ITEMS = 50;

  constructor() {
    this.data = this.initializeData();
  }

  private initializeData(): AnalyticsData {
    return {
      totalAddressLookups: 0,
      totalBillSearches: 0,
      totalEmailDrafts: 0,
      totalAPIErrors: 0,
      addressLookupsTimeSeries: [],
      billSearchesTimeSeries: [],
      emailDraftsTimeSeries: [],
      errorsTimeSeries: [],
      billSearchesByType: { federal: 0, state: 0 },
      topBillSearches: new Map(),
      topTopics: new Map(),
      stateDistribution: new Map(),
      errorsByEndpoint: new Map(),
      rateLimitViolations: 0,
      rateLimitByIP: new Map(),
      uniqueIPs: new Set(),
      hourlyActiveUsers: new Map(),
      startTime: Date.now(),
      lastResetTime: Date.now(),
    };
  }

  /**
   * Record an address lookup
   */
  trackAddressLookup(ip: string, state?: string) {
    this.data.totalAddressLookups++;
    this.addToTimeSeries(this.data.addressLookupsTimeSeries);
    this.trackUniqueUser(ip);

    if (state) {
      this.data.stateDistribution.set(
        state,
        (this.data.stateDistribution.get(state) || 0) + 1
      );
    }
  }

  /**
   * Record a bill search
   */
  trackBillSearch(ip: string, query: string, billType: "federal" | "state", jurisdiction?: string) {
    this.data.totalBillSearches++;
    this.addToTimeSeries(this.data.billSearchesTimeSeries);
    this.trackUniqueUser(ip);

    // Track by type
    this.data.billSearchesByType[billType]++;

    // Track top searches (limit to 50 chars for storage)
    const queryKey = query.substring(0, 50).toLowerCase().trim();
    if (queryKey) {
      this.data.topBillSearches.set(
        queryKey,
        (this.data.topBillSearches.get(queryKey) || 0) + 1
      );

      // Keep only top N
      if (this.data.topBillSearches.size > this.MAX_TOP_ITEMS) {
        this.pruneMap(this.data.topBillSearches);
      }
    }

    // Track state distribution for state bills
    if (billType === "state" && jurisdiction) {
      this.data.stateDistribution.set(
        jurisdiction,
        (this.data.stateDistribution.get(jurisdiction) || 0) + 1
      );
    }
  }

  /**
   * Record an email draft
   */
  trackEmailDraft(ip: string, topic: string) {
    this.data.totalEmailDrafts++;
    this.addToTimeSeries(this.data.emailDraftsTimeSeries);
    this.trackUniqueUser(ip);

    // Track top topics
    this.data.topTopics.set(
      topic,
      (this.data.topTopics.get(topic) || 0) + 1
    );

    // Keep only top N
    if (this.data.topTopics.size > this.MAX_TOP_ITEMS) {
      this.pruneMap(this.data.topTopics);
    }
  }

  /**
   * Record an API error
   */
  trackAPIError(endpoint: string, isRateLimit: boolean, ip?: string) {
    this.data.totalAPIErrors++;
    this.addToTimeSeries(this.data.errorsTimeSeries);

    // Track errors by endpoint
    this.data.errorsByEndpoint.set(
      endpoint,
      (this.data.errorsByEndpoint.get(endpoint) || 0) + 1
    );

    // Track rate limiting
    if (isRateLimit) {
      this.data.rateLimitViolations++;
      if (ip) {
        this.data.rateLimitByIP.set(
          ip,
          (this.data.rateLimitByIP.get(ip) || 0) + 1
        );
      }
    }
  }

  /**
   * Track unique user (by IP)
   */
  private trackUniqueUser(ip: string) {
    if (!ip || ip === "anonymous") return;

    // Add to overall unique IPs
    this.data.uniqueIPs.add(ip);

    // Add to hourly active users
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
    if (!this.data.hourlyActiveUsers.has(currentHour)) {
      this.data.hourlyActiveUsers.set(currentHour, new Set());
    }
    this.data.hourlyActiveUsers.get(currentHour)!.add(ip);

    // Clean up old hours (keep last 24 hours)
    const cutoffHour = currentHour - 24;
    for (const hour of Array.from(this.data.hourlyActiveUsers.keys())) {
      if (hour < cutoffHour) {
        this.data.hourlyActiveUsers.delete(hour);
      }
    }
  }

  /**
   * Add data point to time series
   */
  private addToTimeSeries(series: TimeSeriesEntry[]) {
    const now = Date.now();
    const interval = 5 * 60 * 1000; // 5 minutes
    const currentBucket = Math.floor(now / interval) * interval;

    // Find or create current bucket
    let lastEntry = series[series.length - 1];
    if (lastEntry && lastEntry.timestamp === currentBucket) {
      lastEntry.value++;
    } else {
      series.push({ timestamp: currentBucket, value: 1 });
    }

    // Trim old entries (keep last 24 hours)
    const cutoff = now - (24 * 60 * 60 * 1000);
    while (series.length > 0 && series[0].timestamp < cutoff) {
      series.shift();
    }

    // Also enforce max length
    if (series.length > this.MAX_TIME_SERIES_POINTS) {
      series.shift();
    }
  }

  /**
   * Prune a map to keep only top items by value
   */
  private pruneMap(map: Map<string, number>) {
    const entries = Array.from(map.entries());
    entries.sort((a, b) => b[1] - a[1]);
    map.clear();
    entries.slice(0, this.MAX_TOP_ITEMS).forEach(([key, value]) => {
      map.set(key, value);
    });
  }

  /**
   * Get current analytics snapshot
   */
  getSnapshot() {
    const now = Date.now();
    const uptime = now - this.data.startTime;
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

    // Calculate active users in last hour
    const currentHour = Math.floor(now / (1000 * 60 * 60));
    const lastHourUsers = this.data.hourlyActiveUsers.get(currentHour)?.size || 0;

    // Calculate active users in last 24 hours
    const last24HoursUsers = new Set<string>();
    for (const users of Array.from(this.data.hourlyActiveUsers.values())) {
      users.forEach(user => last24HoursUsers.add(user));
    }

    return {
      // Counts
      totalAddressLookups: this.data.totalAddressLookups,
      totalBillSearches: this.data.totalBillSearches,
      totalEmailDrafts: this.data.totalEmailDrafts,
      totalAPIErrors: this.data.totalAPIErrors,
      rateLimitViolations: this.data.rateLimitViolations,

      // Time series
      addressLookupsTimeSeries: this.data.addressLookupsTimeSeries,
      billSearchesTimeSeries: this.data.billSearchesTimeSeries,
      emailDraftsTimeSeries: this.data.emailDraftsTimeSeries,
      errorsTimeSeries: this.data.errorsTimeSeries,

      // Breakdowns
      billSearchesByType: this.data.billSearchesByType,
      topBillSearches: Array.from(this.data.topBillSearches.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20),
      topTopics: Array.from(this.data.topTopics.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20),
      stateDistribution: Array.from(this.data.stateDistribution.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20),
      errorsByEndpoint: Array.from(this.data.errorsByEndpoint.entries())
        .sort((a, b) => b[1] - a[1]),
      rateLimitByIP: Array.from(this.data.rateLimitByIP.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),

      // User metrics
      uniqueUsers: this.data.uniqueIPs.size,
      activeUsersLastHour: lastHourUsers,
      activeUsersLast24Hours: last24HoursUsers.size,

      // System info
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      uptimeMs: uptime,
      startTime: new Date(this.data.startTime).toISOString(),
      lastResetTime: new Date(this.data.lastResetTime).toISOString(),
    };
  }

  /**
   * Reset all analytics data
   */
  reset() {
    this.data = this.initializeData();
  }
}

// Global singleton instance
const analytics = new AnalyticsAggregator();

export default analytics;
