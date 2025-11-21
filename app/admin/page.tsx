"use client";

import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";

interface AnalyticsData {
  // Counts
  totalAddressLookups: number;
  totalBillSearches: number;
  totalEmailDrafts: number;
  totalAPIErrors: number;
  rateLimitViolations: number;

  // Time series
  addressLookupsTimeSeries: Array<{ timestamp: number; value: number }>;
  billSearchesTimeSeries: Array<{ timestamp: number; value: number }>;
  emailDraftsTimeSeries: Array<{ timestamp: number; value: number }>;
  errorsTimeSeries: Array<{ timestamp: number; value: number }>;

  // Breakdowns
  billSearchesByType: { federal: number; state: number };
  topBillSearches: Array<[string, number]>;
  topTopics: Array<[string, number]>;
  stateDistribution: Array<[string, number]>;
  errorsByEndpoint: Array<[string, number]>;
  rateLimitByIP: Array<[string, number]>;

  // User metrics
  uniqueUsers: number;
  activeUsersLastHour: number;
  activeUsersLast24Hours: number;

  // System info
  uptime: string;
  uptimeMs: number;
  startTime: string;
  lastResetTime: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async (pwd: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/analytics?password=${encodeURIComponent(pwd)}`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to fetch analytics");
      }

      setData(json.data);
      setIsAuthenticated(true);
      setLastUpdated(new Date());
      // Save password to sessionStorage for auto-refresh
      if (typeof window !== "undefined") {
        sessionStorage.setItem("adminPassword", pwd);
      }
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("adminPassword");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics(password);
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all analytics data? This cannot be undone.")) {
      return;
    }

    try {
      const pwd = sessionStorage.getItem("adminPassword") || password;
      const response = await fetch(`/api/admin/analytics/reset?password=${encodeURIComponent(pwd)}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reset analytics");
      }

      // Refresh data
      fetchAnalytics(pwd);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;

    const interval = setInterval(() => {
      const pwd = typeof window !== "undefined" ? sessionStorage.getItem("adminPassword") : null;
      if (pwd) {
        fetchAnalytics(pwd);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh]);

  // Try to authenticate on mount if password is in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPassword = sessionStorage.getItem("adminPassword");
      if (savedPassword) {
        setPassword(savedPassword);
        fetchAnalytics(savedPassword);
      }
    }
  }, []);

  // Login form
  if (!isAuthenticated) {
    return (
      <>
        <TopNav />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="card-elevated rounded-2xl p-8 w-full max-w-md">
            <h1 className="text-3xl text-gray-900 mb-6 text-center">Admin Dashboard</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-focus-enhanced w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !password}
                className="btn-hover-lift w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>
          </div>
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <TopNav />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading analytics...</div>
        </main>
      </>
    );
  }

  // Calculate conversion metrics
  const conversionRate = data.totalAddressLookups > 0
    ? ((data.totalEmailDrafts / data.totalAddressLookups) * 100).toFixed(1)
    : "0.0";

  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                System uptime: {data.uptime} | Last updated: {lastUpdated?.toLocaleTimeString() || "Never"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                Auto-refresh (10s)
              </label>
              <button
                onClick={() => {
                  const pwd = sessionStorage.getItem("adminPassword") || password;
                  fetchAnalytics(pwd);
                }}
                className="btn-hover-lift bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm"
              >
                Refresh Now
              </button>
              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md text-sm"
              >
                Reset Data
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Address Lookups */}
            <div className="card-elevated rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-1">Address Lookups</div>
              <div className="text-3xl font-semibold text-gray-900">{data.totalAddressLookups.toLocaleString()}</div>
            </div>

            {/* Bill Searches */}
            <div className="card-elevated rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-1">Bill Searches</div>
              <div className="text-3xl font-semibold text-gray-900">{data.totalBillSearches.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {data.billSearchesByType.federal} federal, {data.billSearchesByType.state} state
              </div>
            </div>

            {/* Email Drafts */}
            <div className="card-elevated rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-1">Email Drafts</div>
              <div className="text-3xl font-semibold text-gray-900">{data.totalEmailDrafts.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {conversionRate}% conversion rate
              </div>
            </div>

            {/* Active Users */}
            <div className="card-elevated rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-1">Active Users</div>
              <div className="text-3xl font-semibold text-gray-900">{data.uniqueUsers.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {data.activeUsersLastHour} in last hour
              </div>
            </div>

            {/* Errors */}
            <div className="card-elevated rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-1">API Errors</div>
              <div className="text-3xl font-semibold text-red-600">{data.totalAPIErrors.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {data.rateLimitViolations} rate limits
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Over Time */}
            <div className="card-elevated rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Over Time (24h)</h2>
              <div className="space-y-4">
                <ActivityChart
                  label="Address Lookups"
                  data={data.addressLookupsTimeSeries}
                  color="bg-blue-500"
                />
                <ActivityChart
                  label="Bill Searches"
                  data={data.billSearchesTimeSeries}
                  color="bg-green-500"
                />
                <ActivityChart
                  label="Email Drafts"
                  data={data.emailDraftsTimeSeries}
                  color="bg-purple-500"
                />
              </div>
            </div>

            {/* Top Bill Searches */}
            <div className="card-elevated rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Bill Searches</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {data.topBillSearches.length === 0 ? (
                  <p className="text-gray-500 text-sm">No bill searches yet</p>
                ) : (
                  data.topBillSearches.map(([query, count], index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700 truncate flex-1">{query}</span>
                      <span className="text-sm font-semibold text-gray-900 ml-4">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Topics */}
            <div className="card-elevated rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Topics</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {data.topTopics.length === 0 ? (
                  <p className="text-gray-500 text-sm">No drafts yet</p>
                ) : (
                  data.topTopics.map(([topic, count], index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">{formatTopic(topic)}</span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* State Distribution */}
            <div className="card-elevated rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Geographic Distribution</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {data.stateDistribution.length === 0 ? (
                  <p className="text-gray-500 text-sm">No location data yet</p>
                ) : (
                  data.stateDistribution.map(([state, count], index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">{state}</span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Errors by Endpoint */}
            <div className="card-elevated rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Errors by Endpoint</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {data.errorsByEndpoint.length === 0 ? (
                  <p className="text-green-600 text-sm font-semibold">✓ No errors!</p>
                ) : (
                  data.errorsByEndpoint.map(([endpoint, count], index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700 font-mono text-xs">{endpoint}</span>
                      <span className="text-sm font-semibold text-red-600">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Rate Limiting */}
          {data.rateLimitViolations > 0 && (
            <div className="card-elevated rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate Limit Violations (Top IPs)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.rateLimitByIP.map(([ip, count], index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-gray-700 font-mono truncate">{ip}</div>
                    <div className="text-2xl font-semibold text-red-600 mt-1">{count} violations</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Info */}
          <div className="card-elevated rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Server Start Time</div>
                <div className="text-gray-900 font-mono">{new Date(data.startTime).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600">Last Data Reset</div>
                <div className="text-gray-900 font-mono">{new Date(data.lastResetTime).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600">Uptime</div>
                <div className="text-gray-900 font-mono">{data.uptime}</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> Analytics data is stored in-memory and will be lost when the server restarts.
                For persistent analytics, consider integrating with Plausible Analytics or migrating to Redis/Vercel KV.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Helper component for time series visualization
function ActivityChart({ label, data, color }: { label: string; data: Array<{ timestamp: number; value: number }>; color: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{totalValue} total</span>
      </div>
      <div className="flex items-end gap-1 h-16">
        {data.length === 0 ? (
          <div className="w-full flex items-center justify-center text-xs text-gray-400">
            No data yet
          </div>
        ) : (
          data.slice(-48).map((point, index) => {
            const height = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
            return (
              <div
                key={index}
                className={`flex-1 ${color} rounded-t opacity-75 hover:opacity-100 transition-opacity`}
                style={{ height: `${height}%`, minHeight: point.value > 0 ? "2px" : "0" }}
                title={`${point.value} at ${new Date(point.timestamp).toLocaleTimeString()}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// Format topic names
function formatTopic(topic: string): string {
  return topic
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
