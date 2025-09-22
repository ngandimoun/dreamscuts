# 🎬 Production Planner - Phase 0 Setup Guide

## Overview

Phase 0 establishes the foundation for the Production Planner system. This phase creates the database schema, validation schemas, and basic infrastructure needed for the Production Planner to bridge creative planning (Analyzer → Refiner → Script Enhancer) with technical production execution.

## What's Included in Phase 0

### ✅ Database Schema
- **`production_manifest`** table - Stores complete production plans
- **`production_assets`** table - Tracks all assets (user-provided and AI-generated)
- **`production_scenes`** table - Detailed scene breakdown for execution
- **Extended `jobs`** table - Production-specific job types and configurations
- **Views and functions** - For monitoring and progress tracking
- **Row Level Security (RLS)** - Proper access control

### ✅ Validation Schemas
- **Zod schemas** for type-safe validation
- **Production manifest validation** with comprehensive error reporting
- **Asset, scene, and job validation** schemas
- **Integration schemas** for connecting with existing services

### ✅ TypeScript Types
- **Complete type definitions** for all production planner entities
- **API request/response types** for database operations
- **Error handling types** with proper error classification
- **Configuration and utility types**

### ✅ Database Service
- **CRUD operations** for production manifests, assets, and scenes
- **Validation integration** with automatic quality scoring
- **Progress tracking** and monitoring capabilities
- **Error handling** with proper logging

### ✅ Test Infrastructure
- **Phase 0 test page** at `/test-production-planner-phase0`
- **Sample manifest data** for testing validation
- **Configuration testing** and constants verification

## Setup Instructions

### 1. Database Migration

Run the database migration to create the Production Planner tables:

```bash
# Run the migration
npm run db:migrate:production-planner

# Or if you need to reset and recreate
npm run db:reset:production-planner
```

### 2. Environment Variables

Ensure you have the required environment variables in your `.env.local`:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Test the Setup

Visit the test page to verify everything is working:

```
http://localhost:3000/test-production-planner-phase0
```

Click "Run Phase 0 Tests" to verify:
- ✅ Schema validation is working
- ✅ Configuration is loaded correctly
- ✅ Constants are properly defined
- ✅ Type safety is maintained

## Database Schema Details

### Production Manifest Table

The main table that stores complete production plans:

```sql
CREATE TABLE production_manifest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analyzer_id TEXT, -- Links to analyzer result
  refiner_id TEXT, -- Links to dreamcut_refiner table
  script_enhancer_id TEXT, -- Links to script_enhancer_results table
  manifest_version TEXT DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'draft',
  priority INTEGER DEFAULT 0,
  duration_seconds INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL,
  platform TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  orientation TEXT CHECK (orientation IN ('landscape', 'portrait', 'square')),
  manifest_data JSONB NOT NULL, -- Complete production manifest structure
  validation_status TEXT DEFAULT 'pending',
  validation_errors JSONB DEFAULT '[]',
  quality_score DECIMAL(3,2),
  -- ... timestamps and metadata
);
```

### Production Assets Table

Tracks all assets for a production:

```sql
CREATE TABLE production_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_manifest_id UUID REFERENCES production_manifest(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL, -- Original asset ID from analyzer/refiner
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'audio', 'text', 'chart', 'effect')),
  source TEXT NOT NULL CHECK (source IN ('user_upload', 'ai_generated', 'stock', 'enhanced')),
  -- ... asset metadata and processing status
);
```

### Production Scenes Table

Detailed scene breakdown:

```sql
CREATE TABLE production_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_manifest_id UUID REFERENCES production_manifest(id) ON DELETE CASCADE,
  scene_id TEXT NOT NULL, -- Original scene ID from script enhancer
  scene_order INTEGER NOT NULL,
  start_time_seconds DECIMAL(10,3) NOT NULL,
  duration_seconds DECIMAL(10,3) NOT NULL,
  end_time_seconds DECIMAL(10,3) GENERATED ALWAYS AS (start_time_seconds + duration_seconds) STORED,
  -- ... scene content and processing status
);
```

## Validation Schema Examples

### Basic Manifest Validation

```typescript
import { validateManifest } from '@/lib/production-planner';

const manifestData = {
  manifest_version: '1.0.0',
  status: 'draft',
  duration_seconds: 60,
  aspect_ratio: '16:9',
  platform: 'youtube',
  language: 'en',
  scenes: [...],
  assets: [...],
  jobs: [...]
};

const result = validateManifest(manifestData);
if (result.valid) {
  console.log('Valid manifest:', result.data);
} else {
  console.log('Validation errors:', result.errors);
}
```

### Database Operations

```typescript
import { createProductionPlannerDatabase } from '@/lib/production-planner';

const db = createProductionPlannerDatabase();

// Create a manifest
const result = await db.createProductionManifest({
  user_id: 'user-123',
  duration_seconds: 60,
  aspect_ratio: '16:9',
  platform: 'youtube',
  manifest_data: manifestData
});

if (result.success) {
  console.log('Created manifest:', result.data.id);
}
```

## Supported Features

### Platforms
- YouTube, Instagram, TikTok, Facebook, Twitter, LinkedIn, Web

### Aspect Ratios
- 16:9, 9:16, 1:1, 4:3, 3:4, 21:9

### Languages
- English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi

### Job Types
- `voiceover_generation` - ElevenLabs voice synthesis
- `music_generation` - ElevenLabs music creation
- `image_generation` - AI image generation
- `video_generation_ai` - AI video generation
- `chart_generation` - GPT-4o chart creation
- `subtitle_generation` - Automatic subtitles
- `lipsync_processing` - Lip sync with video
- `visual_effects` - Cinematic effects
- `asset_enhancement` - Image/video enhancement
- `consistency_check` - Character/style consistency
- `quality_validation` - Quality assurance
- `final_assembly` - Final video assembly
- `rendering` - Final rendering

## Quality Thresholds

- **Excellent**: 0.9+
- **Good**: 0.8+
- **Acceptable**: 0.7+
- **Poor**: 0.6+
- **Unacceptable**: <0.6

## Next Steps

Phase 0 provides the foundation. The next phases will build upon this:

- **Phase 1**: Manifest creation and validation logic
- **Phase 2**: Job generation and dependency management  
- **Phase 3**: Integration with existing services (Refiner, Script Enhancer)
- **Phase 4**: Production execution and monitoring

## Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and service role key
- Check that the migration ran successfully
- Ensure RLS policies are properly configured

### Validation Errors
- Check the test page for detailed validation results
- Verify your manifest data matches the expected schema
- Review the error messages for specific field issues

### Type Errors
- Ensure you're importing types from the correct path
- Check that your TypeScript configuration is up to date
- Verify that all required dependencies are installed

## Support

If you encounter issues with Phase 0 setup:

1. Check the test page results for specific error details
2. Review the database migration logs
3. Verify your environment variables are correct
4. Check the browser console for any client-side errors

The Phase 0 setup is designed to be robust and provide clear error messages to help with troubleshooting.
