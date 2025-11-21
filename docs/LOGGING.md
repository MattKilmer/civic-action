# Usage Logging

This document describes the logging infrastructure for monitoring user activity and system health.

## Overview

The application implements comprehensive logging to track:
- User actions (address lookups, bill searches, email drafts)
- API errors and rate limiting
- System performance and usage patterns

All logs are output to console (stdout/stderr) where they can be captured by:
- **Vercel Logs** (built-in, free tier includes 1-day retention)
- **External log aggregation** (Datadog, New Relic, LogRocket, etc.)
- **Custom analytics** (Plausible, Mixpanel, etc.)

## Logging Functions

Located in `/app/lib/logger.ts`:

### `logAddressLookup`
Tracks when users look up their representatives by address.

**Data captured:**
- Address hash (for privacy - not the actual address)
- Number of officials found
- IP address
- User agent

**Example log:**
```
[INFO] address_lookup {
  timestamp: "2025-11-21T10:30:45.123Z",
  event: "address_lookup",
  data: {
    addressHash: "abc123",
    officialsFound: 12
  },
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

### `logBillSearch`
Tracks bill searches (federal and state).

**Data captured:**
- Search query (truncated to 50 chars)
- Bill type (federal or state)
- Jurisdiction (for state bills)
- Number of results
- IP address
- User agent

**Example log:**
```
[INFO] bill_search {
  timestamp: "2025-11-21T10:31:22.456Z",
  event: "bill_search",
  data: {
    query: "education",
    billType: "state",
    jurisdiction: "California",
    resultsCount: 20
  },
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

### `logEmailDraft`
Tracks AI-generated email drafts.

**Data captured:**
- Topic
- Stance (support or oppose)
- Bill number (if applicable)
- Official role being contacted
- Word count of generated draft
- IP address
- User agent

**Example log:**
```
[INFO] email_draft {
  timestamp: "2025-11-21T10:32:10.789Z",
  event: "email_draft",
  data: {
    topic: "climate_change",
    stance: "support",
    billNumber: "HR 1234",
    officialRole: "U.S. Representative",
    wordCount: 187
  },
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

### `logAPIError`
Tracks API errors and rate limiting events.

**Data captured:**
- API endpoint
- Error message
- HTTP status code
- IP address
- User agent

**Example log:**
```
[ERROR] api_error {
  timestamp: "2025-11-21T10:33:05.123Z",
  event: "api_error",
  data: {
    endpoint: "/api/reps",
    error: "Rate limit exceeded",
    statusCode: 429
  },
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

## Privacy Considerations

**What we log:**
- Hashed addresses (not actual addresses)
- IP addresses (for rate limiting and abuse prevention)
- User agents (for debugging browser issues)
- Action types and counts

**What we DON'T log:**
- Actual addresses entered by users
- Full email draft content
- Personal information
- Political positions or stances (beyond aggregated counts)

## Rate Limiting

All API endpoints have rate limiting in place to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/reps` (Address lookup) | 30 requests | per minute |
| `/api/ai/draft` (Email generation) | 15 requests | per minute |
| `/api/bills/search` (Federal bills) | No limit | - |
| `/api/bills/search-state` (State bills) | 15 requests | per minute |

Rate limit violations are logged as errors and return HTTP 429 status.

## Viewing Logs

### Local Development
Logs appear in the terminal where `npm run dev` is running:
```bash
npm run dev
# Watch for [INFO], [WARN], [ERROR] prefixed messages
```

### Production (Vercel)
1. Go to Vercel Dashboard → Your Project → Logs
2. Filter by:
   - **Level**: info, warn, error
   - **Event**: address_lookup, bill_search, email_draft, api_error
3. Export logs for analysis

### Custom Log Aggregation
To send logs to external services, modify `/app/lib/logger.ts`:

```typescript
export function logEvent(event: string, data?: Record<string, any>, ...) {
  // Existing console logging
  console.log(logMessage, logEntry);

  // Add custom service integration:
  // Example: Send to Datadog
  if (process.env.DATADOG_API_KEY) {
    await fetch('https://http-intake.logs.datadoghq.com/v1/input', {
      method: 'POST',
      headers: {
        'DD-API-KEY': process.env.DATADOG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry),
    });
  }
}
```

## Metrics to Monitor

### Usage Metrics
- **Address lookups per day** - Track user acquisition
- **Bills searched** - Measure bill search feature adoption
- **Email drafts generated** - Core conversion metric
- **Most searched bills** - Understand trending issues

### Performance Metrics
- **API error rates** - Identify reliability issues
- **Rate limit violations** - Detect abuse or UX issues
- **5 Calls API failures** - Monitor external dependency
- **Congress.gov API timeouts** - Track federal bill search health
- **LegiScan API rate limits** - Monitor state bill search quota

### Security Metrics
- **Rate limit violations by IP** - Detect potential abuse
- **Failed validation attempts** - Identify malicious inputs
- **API key usage** - Monitor external API quotas

## Example Queries

### Most Popular Topics
```javascript
// Filter logs for: event="email_draft"
// Group by: data.topic
// Count: total occurrences
```

### Daily Active Users (Approximate)
```javascript
// Filter logs for: event="address_lookup"
// Group by: date + IP hash
// Count: unique combinations per day
```

### Error Rate
```javascript
// Count logs where: level="error"
// Divide by: total API requests
// Multiply by: 100 for percentage
```

### Bill Search Popularity
```javascript
// Filter logs for: event="bill_search"
// Group by: data.query
// Count: total occurrences
// Sort: descending
```

## Future Enhancements

Potential logging improvements for post-MVP:

1. **Event Sampling** - Only log 10% of successful requests to reduce volume
2. **Structured Analytics** - Integrate with Plausible or Mixpanel for user analytics
3. **Real-time Dashboards** - Build Grafana/Datadog dashboards for monitoring
4. **Anomaly Detection** - Alert on unusual patterns (spike in errors, rate limit violations)
5. **User Journey Tracking** - Track full user flow from address → issue → draft → send
6. **A/B Testing** - Log experiment variants for feature testing
7. **Performance Tracing** - Add OpenTelemetry for detailed performance monitoring

## Compliance

This logging implementation is designed to be compliant with:
- **GDPR** - No PII stored, IP addresses for legitimate security purposes only
- **CCPA** - No data sale, no personal data retention
- **SOC 2** - Audit trail for security events and errors

All logs should be retained for a maximum of 30 days unless required for security investigation.
