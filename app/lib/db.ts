/**
 * Database Connection for Neon PostgreSQL
 * Uses @neondatabase/serverless for edge runtime compatibility
 */

import { neon } from "@neondatabase/serverless";

// Get database URL from environment
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("DATABASE_URL or POSTGRES_URL environment variable is not set");
  }
  return url;
};

// Create SQL query executor
export const sql = neon(getDatabaseUrl());

/**
 * Initialize database schema
 * Creates tables if they don't exist
 */
export async function initializeDatabase() {
  try {
    // Analytics events table - stores all individual events
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL, -- 'address_lookup', 'bill_search', 'email_draft', 'api_error'
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        -- User context (anonymized)
        ip_hash VARCHAR(64), -- SHA-256 hash of IP
        user_agent TEXT,

        -- Event-specific data (all optional)
        state VARCHAR(50), -- For address lookups and geographic distribution
        bill_type VARCHAR(20), -- 'federal' or 'state'
        jurisdiction VARCHAR(100), -- State name for state bills
        query TEXT, -- Bill search query
        topic VARCHAR(200), -- Email draft topic
        endpoint VARCHAR(100), -- API endpoint for errors
        error_message TEXT, -- Error details

        -- Indexes for common queries
        INDEX idx_event_type (event_type),
        INDEX idx_timestamp (timestamp),
        INDEX idx_state (state)
      )
    `;

    // Rate limit violations table
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limit_violations (
        id SERIAL PRIMARY KEY,
        ip_hash VARCHAR(64) NOT NULL,
        endpoint VARCHAR(100) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        INDEX idx_ip_hash (ip_hash),
        INDEX idx_timestamp (timestamp)
      )
    `;

    console.log("Database schema initialized successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return { success: false, error };
  }
}
