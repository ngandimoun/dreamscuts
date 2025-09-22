# Profile-Pipeline Integration Tests

This directory contains comprehensive tests for the Profile-Pipeline Integration system, ensuring that creative profiles and workflow pipelines work seamlessly together without crashes or overrides.

## Test Structure

### Core Test Files

- **`profile-pipeline-integration.test.ts`** - Main integration tests covering profile context injection, hard constraints enforcement, conflict resolution, and feature flags integration
- **`golden-tests.test.ts`** - Golden tests that validate complete workflows from profile selection through job decomposition for common use cases
- **`worker-constraint-enforcement.test.ts`** - Tests validating that workers properly enforce hard constraints and apply profile context
- **`snapshot-tests.test.ts`** - Snapshot tests ensuring consistent, deterministic output that can be validated against known good snapshots

### Configuration Files

- **`jest.config.js`** - Jest configuration for TypeScript support, coverage, and test environment setup
- **`setup.ts`** - Test setup with mocks for external services, environment variables, and global utilities
- **`global-setup.ts`** - Global setup for test environment initialization
- **`global-teardown.ts`** - Global teardown for test environment cleanup

## Test Categories

### 1. Profile Context Injection Tests
- Validates that profile context is properly injected into manifest metadata
- Ensures hard constraints are applied from profiles
- Tests precedence order: UI > Recipe > Profile > Refiner > Analyzer > Worker Enhancements

### 2. Hard Constraints Enforcement Tests
- Validates color palette clamping to profile constraints
- Tests effects filtering based on profile constraints
- Ensures voice style clamping to profile constraints

### 3. Conflict Resolution Tests
- Tests conflict resolution between profile and manifest
- Validates warning logging for clamped values
- Ensures graceful handling of invalid constraints

### 4. Feature Flags Integration Tests
- Tests feature flag application based on profile
- Validates job validation against feature flags
- Tests cost and timeout cap enforcement

### 5. Model Selection Matrix Tests
- Validates profile-pipeline matrix loading
- Tests correct model mappings for each profile
- Ensures cost-effective models for educational profiles

### 6. Workflow Recipes Tests
- Tests workflow recipe loading
- Validates correct recipe steps
- Ensures UGC recipes include proper workflow steps

### 7. End-to-End Integration Tests
- Tests complete profile-pipeline integration workflows
- Validates profile overrides
- Ensures proper context passing to all jobs

### 8. Worker Constraint Enforcement Tests
- Tests TTS worker constraint enforcement
- Validates constraint precedence over worker enhancements
- Tests error handling for invalid constraints

### 9. Snapshot Tests
- Ensures consistent output for educational, UGC, marketing, and cinematic profiles
- Validates conflict resolution produces consistent results
- Tests UI override behavior

## Running Tests

### Prerequisites
```bash
npm install --save-dev jest ts-jest @jest/globals
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
npm test -- profile-pipeline-integration.test.ts
npm test -- golden-tests.test.ts
npm test -- worker-constraint-enforcement.test.ts
npm test -- snapshot-tests.test.ts
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Update Snapshots
```bash
npm test -- --updateSnapshot
```

## Test Data

### Mock Manifests
- **Educational Manifest** - 60-second educational tutorial with 3 scenes
- **UGC Manifest** - 30-second UGC testimonial with 1 scene
- **Marketing Manifest** - 45-second marketing video with 3 scenes

### Mock Profiles
- **Educational Explainer** - Strict constraints, professional tone, minimalist visuals
- **UGC Testimonial** - Balanced constraints, casual tone, handheld visuals
- **UGC Reaction** - Creative constraints, enthusiastic tone, dynamic visuals
- **Marketing Dynamic** - Creative constraints, energetic tone, cinematic visuals
- **Cinematic Trailer** - Creative constraints, dramatic tone, high-impact visuals

### Mock Constraints
- **Style Constraints** - Color palette, fonts, visual style
- **Effects Constraints** - Allowed/forbidden effect types
- **Audio Constraints** - Tone, voice style, music intensity
- **Pacing Constraints** - Max speed, transition style
- **Platform Constraints** - Aspect ratio, platform-specific settings

## Test Scenarios

### 1. Educational Content Workflow
- Profile: Educational Explainer
- Enforcement: Strict
- Expected: Minimalist visuals, clear voice, professional tone, cost-effective models

### 2. UGC Content Workflow
- Profile: UGC Testimonial
- Enforcement: Balanced
- Expected: Handheld visuals, conversational voice, casual tone, moderate cost

### 3. Marketing Content Workflow
- Profile: Marketing Dynamic
- Enforcement: Creative
- Expected: Cinematic visuals, dramatic voice, energetic tone, high-quality models

### 4. Constraint Violation Scenarios
- Invalid color palettes
- Forbidden effects
- Exceeded cost caps
- Exceeded timeout caps
- Quality gate failures

### 5. Profile Override Scenarios
- UI override of profile selection
- Recipe override of profile selection
- Enforcement mode overrides
- Feature flag overrides

## Assertions

### Profile Context Assertions
- Profile ID matches expected value
- Profile context contains required fields
- Enhancement policy is correctly set
- Pipeline configuration is properly mapped

### Constraint Enforcement Assertions
- Color palettes are clamped to allowed values
- Effects are filtered to allowed types
- Voice styles are clamped to profile constraints
- Audio tones match profile requirements

### Feature Flag Assertions
- Prompt enhancement mode matches profile
- Cost caps are properly applied
- Timeout caps are properly applied
- Quality gates are properly enforced

### Job Decomposition Assertions
- Correct number of jobs generated
- Job types match expected workflow
- Job payloads contain profile context
- Job payloads contain hard constraints

## Mock Services

### External APIs
- Supabase client and storage
- ElevenLabs TTS service
- Fal.ai image/video generation
- VEED lip-sync service
- Shotstack rendering service

### File System
- File reading and writing operations
- Directory creation and access
- Configuration file loading

### Workers
- TTS worker with constraint enforcement
- Image worker with C.R.I.S.T.A.L method
- Video worker with cinematic prompts
- Lip-sync worker with fallback providers

## Coverage Goals

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## Continuous Integration

Tests are designed to run in CI/CD pipelines with:
- Deterministic output (no flaky tests)
- Fast execution (<30 seconds total)
- Comprehensive coverage
- Clear failure messages
- Snapshot validation

## Troubleshooting

### Common Issues

1. **Snapshot Mismatches**
   - Run `npm test -- --updateSnapshot` to update snapshots
   - Check for changes in profile configurations
   - Verify test data consistency

2. **Mock Failures**
   - Ensure all external services are properly mocked
   - Check environment variable setup
   - Verify file system mocks

3. **Timeout Issues**
   - Increase test timeout in jest.config.js
   - Check for infinite loops in test code
   - Verify async/await usage

4. **Coverage Issues**
   - Check coverage thresholds in jest.config.js
   - Ensure all code paths are tested
   - Verify mock coverage

### Debug Mode
```bash
npm test -- --verbose --no-coverage
```

### Test Specific Profile
```bash
npm test -- --testNamePattern="Educational Explainer"
```

### Test Specific Constraint
```bash
npm test -- --testNamePattern="Hard Constraints"
```
