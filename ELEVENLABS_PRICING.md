# ElevenLabs Pricing & Usage Tracking

## 📊 Overview

This document provides comprehensive information about ElevenLabs API pricing, usage tracking, and cost management features integrated into your ElevenLabs service.

## 💰 Pricing Plans (2024)

### Free Plan
- **Cost**: $0/month
- **Credits**: 10,000 credits/month
- **Features**: Text to Speech, Speech to Text, Voice Isolator, Voice Changer, Dubbing, Conversational AI
- **Usage Examples**:
  - ~10 minutes of high-quality TTS with Multilingual v2
  - ~20 minutes of low-latency TTS with Flash v2.5
  - ~15 minutes of Conversational AI

### Starter Plan
- **Cost**: $5/month
- **Credits**: 30,000 credits/month
- **Features**: All Free features + Commercial license, Instant Voice Cloning, Dubbing Studio API, **Eleven Music API**
- **Usage Examples**:
  - ~30 minutes of high-quality TTS with Multilingual v2
  - ~60 minutes of low-latency TTS with Flash v2.5
  - ~50 minutes of Conversational AI

### Creator Plan
- **Cost**: $22/month (first month 50% off at $11)
- **Credits**: 100,000 credits/month
- **Features**: All Starter features + Professional Voice Cloning, Usage-based billing, Higher quality audio (192 kbps)
- **Additional Credits**: $0.30 per 1,000 credits
- **Usage Examples**:
  - ~100 minutes of high-quality TTS with Multilingual v2
  - ~200 minutes of low-latency TTS with Flash v2.5
  - ~250 minutes of Conversational AI

### Pro Plan
- **Cost**: $99/month
- **Credits**: 500,000 credits/month
- **Features**: All Creator features + 44.1kHz PCM audio output via API
- **Additional Credits**: $0.20 per 1,000 credits
- **Usage Examples**:
  - ~500 minutes of high-quality TTS with Multilingual v2
  - ~1,000 minutes of low-latency TTS with Flash v2.5
  - ~1,100 minutes of Conversational AI

### Scale Plan
- **Cost**: $330/month
- **Credits**: 2,000,000 credits/month
- **Features**: All Pro features + Multi-seat Workspace (3 seats)
- **Additional Credits**: $0.15 per 1,000 credits
- **Usage Examples**:
  - ~2,000 minutes of high-quality TTS with Multilingual v2
  - ~4,000 minutes of low-latency TTS with Flash v2.5
  - ~3,600 minutes of Conversational AI

### Business Plan
- **Cost**: $1,320/month
- **Credits**: 11,000,000 credits/month
- **Features**: All Scale features + Low-latency TTS (5c/minute), 3 Professional Voice Clones, 5 seats
- **Additional Credits**: $0.10 per 1,000 credits
- **Usage Examples**:
  - ~11,000 minutes of high-quality TTS with Multilingual v2
  - ~22,000 minutes of low-latency TTS with Flash v2.5
  - ~13,750 minutes of Conversational AI

### Enterprise Plan
- **Cost**: Custom pricing
- **Credits**: Custom credits and seats
- **Features**: All Business features + Custom terms, BAAs for HIPAA, Custom SSO, Elevated concurrency limits, ElevenStudios fully managed dubbing, Significant discounts at scale, Priority support

## 🧮 Credit System

### Text-to-Speech (TTS)
- **Base Rate**: 1 character = 1 credit
- **Model Variations**:
  - Multilingual v2: 1 character = 1 credit
  - Flash v2.5: 1 character = 0.8 credits (estimated)
  - Eleven v3: 1 character = 1 credit

### Music Generation
- **Rate**: ~2,000 credits per minute
- **Duration Range**: 10 seconds to 5 minutes
- **Quality**: Professional-grade MP3 (44.1kHz, 128-192kbps)

### Sound Effects
- **Base Rate**: ~500 credits per generation
- **Duration Cost**: +10 credits per second
- **Duration Range**: 1-30 seconds

### Voice Design
- **Rate**: 1,000 credits per generation (3 previews)
- **Models**: Eleven Multilingual TTV v2, Eleven TTV v3

### Voice Cloning
- **Instant Voice Cloning**: 1,000 credits per generation
- **Professional Voice Cloning**: 10,000 credits per generation

### Conversational AI
- **Rate**: ~100 credits per minute

## 📈 Usage Tracking Features

### Real-time Cost Estimation
```typescript
// Estimate cost before making requests
const estimate = pricingManager.estimateCost('text_to_speech', {
  text_length: 100,
  model: 'eleven_multilingual_v2'
});
console.log(`Estimated cost: ${estimate.credits} credits, $${estimate.cost_usd}`);
```

### Credit Calculations
```typescript
// Calculate credits for different services
const ttsCredits = pricingManager.calculateTTSCredits("Hello, world!");
const musicCredits = pricingManager.calculateMusicCredits(60000); // 1 minute
const soundEffectCredits = pricingManager.calculateSoundEffectCredits(5); // 5 seconds
const voiceDesignCredits = pricingManager.calculateVoiceDesignCredits();
```

### Usage Recording
```typescript
// Track usage for billing
pricingManager.recordUsage({
  service: 'text_to_speech',
  user_id: 'user_123',
  session_id: 'session_456',
  credits_used: 100,
  cost_usd: 0.01,
  details: {
    text_length: 100,
    model_used: 'eleven_multilingual_v2',
    voice_id: 'voice_1'
  }
});
```

### Usage Analytics
```typescript
// Get comprehensive usage summary
const summary = pricingManager.getUsageSummary();
console.log('Total Credits:', summary.total_credits);
console.log('Total Cost:', summary.total_cost);
console.log('Service Breakdown:', summary.service_breakdown);
console.log('Daily Usage:', summary.daily_usage);

// Filter by user, service, or date range
const userUsage = pricingManager.getUsageSummary({ user_id: 'user_123' });
const serviceUsage = pricingManager.getUsageSummary({ service: 'text_to_speech' });
const dateRangeUsage = pricingManager.getUsageSummary({
  start_date: new Date('2024-01-01'),
  end_date: new Date('2024-01-31')
});
```

## 🎯 Plan Recommendations

### Cost-Effective Plan Selection
```typescript
// Get recommended plan based on monthly usage
const monthlyCredits = 50000;
const recommendedPlan = pricingManager.getRecommendedPlan(monthlyCredits);
console.log(`Recommended plan: ${recommendedPlan.name}`);
```

### Plan Comparison
```typescript
// Compare costs across different plans
const credits = 100000;
const plans = ['Free', 'Starter', 'Creator', 'Pro', 'Scale', 'Business'];

plans.forEach(planName => {
  const plan = pricingManager.getPlan(planName);
  const cost = pricingManager.calculateCost(credits, plan);
  console.log(`${planName}: $${cost.total_cost.toFixed(2)}`);
});
```

## 📊 Real-World Usage Scenarios

### Podcast Production
- **Script Length**: 2,000 characters
- **Credits**: 2,000 credits
- **Cost (Free Plan)**: $0.00
- **Cost (Starter Plan)**: $5.00
- **Cost (Creator Plan)**: $22.00

### Video Game Soundtrack
- **Duration**: 4 tracks × 2 minutes each = 8 minutes total
- **Credits**: 16,000 credits
- **Cost (Free Plan)**: $0.00 (exceeds free limit)
- **Cost (Starter Plan)**: $5.00
- **Cost (Creator Plan)**: $22.00

### E-learning Course
- **Modules**: 10 modules × 1,000 characters each = 10,000 characters
- **Credits**: 10,000 credits
- **Cost (Free Plan)**: $0.00
- **Cost (Starter Plan)**: $5.00
- **Cost (Creator Plan)**: $22.00

### Marketing Campaign
- **Ads**: 5 ads × 200 characters each = 1,000 characters
- **Credits**: 1,000 credits
- **Cost (Free Plan)**: $0.00
- **Cost (Starter Plan)**: $5.00
- **Cost (Creator Plan)**: $22.00

### Audiobook Production
- **Chapters**: 20 chapters × 5,000 characters each = 100,000 characters
- **Credits**: 100,000 credits
- **Cost (Free Plan)**: $0.00 (exceeds free limit)
- **Cost (Starter Plan)**: $5.00 (exceeds starter limit)
- **Cost (Creator Plan)**: $22.00
- **Cost (Pro Plan)**: $99.00

## 🔧 API Endpoints

### Pricing Information
```
GET /api/elevenlabs/pricing?type=plans
GET /api/elevenlabs/pricing?type=current_plan
GET /api/elevenlabs/pricing?type=service_pricing&service=text_to_speech
```

### Usage Tracking
```
GET /api/elevenlabs/pricing?type=usage_summary&user_id=user_123
GET /api/elevenlabs/pricing?type=usage_records&service=text_to_speech
```

### Cost Calculations
```
POST /api/elevenlabs/pricing
{
  "action": "estimate_cost",
  "service": "text_to_speech",
  "details": { "text_length": 100 }
}
```

### Plan Management
```
POST /api/elevenlabs/pricing
{
  "action": "set_plan",
  "plan_name": "Creator"
}
```

## 📈 Cost Optimization Tips

### 1. Choose the Right Plan
- **Free Plan**: Perfect for testing and small projects
- **Starter Plan**: Ideal for small businesses and content creators
- **Creator Plan**: Best for professional content creation
- **Pro Plan**: Suitable for high-volume applications
- **Scale/Business**: For enterprise-level usage

### 2. Optimize Text Length
- Use concise, clear text
- Remove unnecessary words
- Consider using shorter sentences for better audio quality

### 3. Model Selection
- Use Flash v2.5 for lower latency and cost
- Use Multilingual v2 for high quality
- Use Eleven v3 for best quality and features

### 4. Batch Processing
- Process multiple requests together
- Use streaming for large content
- Cache frequently used audio

### 5. Monitor Usage
- Track usage regularly
- Set up alerts for approaching limits
- Analyze usage patterns to optimize

## 🚨 Important Notes

### API Key Security
- Never expose your API key in client-side code
- Use environment variables for API keys
- Implement proper authentication and authorization

### Usage Limits
- Free plan has strict monthly limits
- Paid plans include overage charges
- Monitor usage to avoid unexpected costs

### Commercial Use
- Free plan: Personal use only
- Starter plan and above: Commercial use allowed
- Check specific terms for your use case

### Billing
- Monthly billing cycles
- Overage charges apply after plan limits
- Enterprise plans have custom billing terms

## 📚 Examples

See `examples/elevenlabs-pricing-examples.ts` for comprehensive examples including:
- Basic pricing information
- Cost estimation
- Credit calculations
- Plan comparisons
- Usage tracking
- Real-world scenarios
- Plan recommendations
- Data export

## 🔗 Resources

- [ElevenLabs Official Pricing](https://elevenlabs.io/pricing/api/)
- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [Music Terms](https://elevenlabs.io/music-terms)
- [API Reference](https://elevenlabs.io/docs/api-reference)
