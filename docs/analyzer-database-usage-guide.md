# 🎬 DreamCut Analyzer Database Usage Guide

## Overview

This guide explains how to use the analyzer database schema to store, query, and stream your analyzer JSON results in Supabase with full realtime support.

## 🗄️ Database Schema

The schema maps your analyzer JSON to 5 normalized tables:

### 1. `analyzer_queries` - Main Query Table
Stores the primary query data including:
- User request details (prompt, intent, duration, etc.)
- Prompt analysis (clarity score, improvements, content type analysis)
- Global analysis (goal, constraints, conflicts)
- Creative direction (core concept, visual approach, mood)
- Production pipeline (workflow steps, quality targets)
- Quality metrics (confidence, completion status, feasibility)

### 2. `analyzer_assets` - Asset Analysis Table
Stores individual asset analysis:
- Asset identification (ID, type, description)
- AI analysis (caption, objects detected, style, mood)
- Quality metrics (score, confidence, processing time)
- File metadata (URL, size, format, resolution)

### 3. `creative_options` - Creative Directions Table
Stores available creative options:
- Option details (ID, title, description, reasons)
- Workload estimation (low/medium/high)
- Selection tracking (is_selected, selection_reason)

### 4. `challenges` - Challenges Table
Stores identified challenges:
- Challenge details (type, description, impact)
- Resolution tracking (is_resolved, resolution_notes)

### 5. `recommendations` - Recommendations Table
Stores recommendations:
- Recommendation details (type, recommendation, priority)
- Implementation tracking (is_implemented, implementation_notes)

## 🚀 Quick Start

### 1. Apply the Migration

```sql
-- Run the migration file
\i docs/analyzer-json-schema-mapping.sql
```

### 2. Basic Usage

```typescript
import { createAnalyzerDatabaseManager } from './lib/analyzer/database';

// Create database manager
const db = createAnalyzerDatabaseManager();

// Store analyzer result
const result = await db.insertAnalyzerResult(userId, analyzerJson);
if (result.success) {
  console.log(`Stored with ID: ${result.queryId}`);
}
```

## 📊 Core Operations

### Store Analyzer Result

```typescript
// Store complete analyzer JSON
const result = await db.insertAnalyzerResult(userId, {
  "user_request": { /* ... */ },
  "prompt_analysis": { /* ... */ },
  "assets": [ /* ... */ ],
  // ... rest of your JSON
});

if (result.success) {
  const queryId = result.queryId;
  // Use queryId for further operations
}
```

### Retrieve Complete Result

```typescript
// Get complete analyzer result as JSON
const result = await db.getAnalyzerResult(queryId);
if (result.success) {
  const analyzerData = result.result; // CompleteAnalyzerResult
  console.log(analyzerData);
}
```

### Query User History

```typescript
// Get all queries for user
const allQueries = await db.getUserAnalyzerQueries(userId);

// Get only completed queries
const completedQueries = await db.getUserAnalyzerQueries(userId, {
  completion_status: 'complete',
  limit: 10
});

// Get queries by intent
const imageQueries = await db.getUserAnalyzerQueries(userId, {
  intent: 'image',
  limit: 5
});
```

## 🔄 Realtime Streaming

### Subscribe to Updates

```typescript
const unsubscribe = db.subscribeToAnalyzerQuery(queryId, {
  onQueryUpdate: (query) => {
    console.log('Query updated:', query);
    // Update UI with new query data
  },
  onAssetUpdate: (asset) => {
    console.log('Asset updated:', asset);
    // Update UI with new asset data
  },
  onCreativeOptionUpdate: (option) => {
    console.log('Creative option updated:', option);
    // Update UI with new creative option
  },
  onChallengeUpdate: (challenge) => {
    console.log('Challenge updated:', challenge);
    // Update UI with new challenge
  },
  onRecommendationUpdate: (recommendation) => {
    console.log('Recommendation updated:', recommendation);
    // Update UI with new recommendation
  },
  onError: (error) => {
    console.error('Realtime error:', error);
  }
});

// Clean up when done
unsubscribe();
```

## 🎨 Creative Options Management

### Select Creative Option

```typescript
// Select a creative option
const success = await selectCreativeOption(queryId, 'opt_modern');
if (success) {
  console.log('Creative option selected');
}
```

### Update Creative Option

```typescript
// Update creative option directly
const result = await db.updateCreativeOption(optionId, {
  is_selected: true,
  selection_reason: 'User preferred this style'
});
```

## ⚠️ Challenge Management

### Resolve Challenge

```typescript
// Mark challenge as resolved
const success = await resolveChallenge(
  queryId, 
  'quality', 
  'Applied contrast enhancement'
);
```

### Add New Challenge

```typescript
// Add new challenge
const result = await db.insertChallenge({
  query_id: queryId,
  type: 'technical',
  description: 'File format compatibility issue',
  impact: 'moderate'
});
```

## 💡 Recommendation Management

### Implement Recommendation

```typescript
// Mark recommendation as implemented
const result = await db.updateRecommendation(recommendationId, {
  is_implemented: true,
  implementation_notes: 'Applied color correction',
  implemented_at: new Date().toISOString()
});
```

### Add New Recommendation

```typescript
// Add new recommendation
const result = await db.insertRecommendation({
  query_id: queryId,
  type: 'creative',
  recommendation: 'Consider adding motion graphics',
  priority: 'high'
});
```

## 📈 Analytics and Reporting

### Get User Analytics

```typescript
const analytics = await db.getAnalyzerAnalytics(userId);
if (analytics.success) {
  const stats = analytics.analytics;
  console.log(`Total queries: ${stats.total_queries}`);
  console.log(`Average confidence: ${stats.average_confidence}`);
  console.log(`Most common intent: ${stats.most_common_intent}`);
}
```

### Custom Queries

```typescript
// Get queries with custom filters
const recentQueries = await db.getUserAnalyzerQueries(userId, {
  created_after: '2024-01-01',
  intent: 'video',
  completion_status: 'complete',
  limit: 20
});
```

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only access their own analyzer queries
- All related data (assets, options, challenges, recommendations) inherit user access
- Service role has full access for background processing

### Data Validation
- All fields have proper constraints and validation
- Foreign key relationships ensure data integrity
- Automatic timestamp updates on all tables

## 🎯 Best Practices

### 1. Use the Helper Functions
```typescript
// ✅ Good: Use the complete workflow
const result = await db.insertAnalyzerResult(userId, analyzerJson);

// ❌ Avoid: Manual table inserts
await db.insertAnalyzerQuery({ /* ... */ });
await db.insertAnalyzerAsset({ /* ... */ });
// ... etc
```

### 2. Subscribe to Realtime Updates
```typescript
// ✅ Good: Subscribe for live updates
const unsubscribe = db.subscribeToAnalyzerQuery(queryId, callbacks);

// ❌ Avoid: Polling for updates
setInterval(() => {
  db.getAnalyzerQuery(queryId);
}, 1000);
```

### 3. Handle Errors Gracefully
```typescript
// ✅ Good: Check success status
const result = await db.insertAnalyzerResult(userId, json);
if (!result.success) {
  console.error('Failed:', result.error);
  return;
}

// ❌ Avoid: Assuming success
const queryId = await db.insertAnalyzerResult(userId, json);
// This might be undefined if the operation failed
```

### 4. Use TypeScript Types
```typescript
// ✅ Good: Use proper types
import type { CompleteAnalyzerResult } from './lib/analyzer/types';

const result: CompleteAnalyzerResult = await db.getAnalyzerResult(queryId);

// ❌ Avoid: Using any
const result: any = await db.getAnalyzerResult(queryId);
```

## 🚨 Error Handling

### Common Error Scenarios

1. **Invalid User ID**
   ```typescript
   const result = await db.insertAnalyzerResult('invalid-user', json);
   // result.success = false, result.error = "User not found"
   ```

2. **Malformed JSON**
   ```typescript
   const result = await db.insertAnalyzerResult(userId, invalidJson);
   // result.success = false, result.error = "Invalid JSON structure"
   ```

3. **Realtime Connection Issues**
   ```typescript
   const unsubscribe = db.subscribeToAnalyzerQuery(queryId, {
     onError: (error) => {
       console.error('Realtime error:', error);
       // Handle connection issues
     }
   });
   ```

## 🔧 Advanced Usage

### Custom Database Functions

The schema includes helper functions:

```sql
-- Insert complete analyzer result
SELECT insert_analyzer_result(user_id, analyzer_json);

-- Get complete analyzer result
SELECT get_analyzer_result(query_id);
```

### Direct SQL Queries

```typescript
// Get queries with custom SQL
const { data, error } = await supabase
  .from('analyzer_queries')
  .select(`
    *,
    analyzer_assets(*),
    creative_options(*),
    challenges(*),
    recommendations(*)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

## 📝 Migration Notes

### Applying the Migration

1. **Backup your database** before applying the migration
2. **Test in development** environment first
3. **Apply during low-traffic periods** for production
4. **Monitor performance** after applying indexes

### Migration Safety

- All tables are created with `IF NOT EXISTS`
- Indexes are created with `IF NOT EXISTS`
- RLS policies are additive (won't break existing access)
- Functions are created with `CREATE OR REPLACE`

## 🎉 Conclusion

This database schema provides a complete solution for storing, querying, and streaming your analyzer JSON results with:

- ✅ **Full JSON mapping** - Every field from your analyzer output
- ✅ **Realtime streaming** - Live updates for all data changes
- ✅ **Type safety** - Complete TypeScript support
- ✅ **Security** - Row-level security and data validation
- ✅ **Performance** - Optimized indexes and queries
- ✅ **Analytics** - Built-in reporting and statistics

Use the examples in `examples/analyzer-database-integration.ts` to get started quickly!
