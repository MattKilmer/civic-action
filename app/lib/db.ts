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
 * Creates tables and indexes if they don't exist
 */
export async function initializeDatabase() {
  try {
    // Analytics events table
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip_hash VARCHAR(64),
        user_agent TEXT,
        state VARCHAR(50),
        bill_type VARCHAR(20),
        jurisdiction VARCHAR(100),
        query TEXT,
        topic VARCHAR(200),
        endpoint VARCHAR(100),
        error_message TEXT
      )
    `;

    // Create indexes for analytics_events
    await sql`CREATE INDEX IF NOT EXISTS idx_event_type ON analytics_events(event_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_timestamp ON analytics_events(timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_state ON analytics_events(state)`;

    // Rate limit violations table
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limit_violations (
        id SERIAL PRIMARY KEY,
        ip_hash VARCHAR(64) NOT NULL,
        endpoint VARCHAR(100) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Create indexes for rate_limit_violations
    await sql`CREATE INDEX IF NOT EXISTS idx_rate_ip_hash ON rate_limit_violations(ip_hash)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rate_timestamp ON rate_limit_violations(timestamp)`;

    console.log("Database schema initialized successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return { success: false, error };
  }
}
