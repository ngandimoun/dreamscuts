/**
 * ElevenLabs Pricing and Usage Examples
 * 
 * This file demonstrates how to track usage, calculate costs, and manage pricing
 * for ElevenLabs API services
 */

import { elevenLabs, pricingManager } from '@/lib/elevenlabs';
import type { ElevenLabsPlan, UsageRecord, CostCalculation } from '@/lib/elevenlabs';

// Example 1: Basic pricing information
export async function basicPricingExample() {
  try {
    console.log("=== Basic Pricing Example ===");

    // Get all available plans
    const plans = pricingManager.getAllPlans();
    console.log("\n--- Available Plans ---");
    plans.forEach(plan => {
      console.log(`${plan.name}: $${plan.cost}/month, ${plan.credits.toLocaleString()} credits`);
      console.log(`  Features: ${plan.features.slice(0, 3).join(', ')}...`);
      console.log(`  Commercial License: ${plan.commercial_license}`);
      console.log(`  Music API: ${plan.music_api}`);
      console.log(`  Voice Cloning: ${plan.voice_cloning}`);
      console.log("");
    });

    // Get current plan
    const currentPlan = pricingManager.getCurrentPlan();
    console.log(`Current Plan: ${currentPlan.name} ($${currentPlan.cost}/month)`);

    // Get service pricing
    const ttsPricing = pricingManager.getServicePricing('text_to_speech');
    console.log(`\nTTS Pricing: ${ttsPricing?.description}`);

    const musicPricing = pricingManager.getServicePricing('music_generation');
    console.log(`Music Pricing: ${musicPricing?.description}`);

    return {
      plans,
      currentPlan,
      ttsPricing,
      musicPricing
    };
  } catch (error) {
    console.error("Basic pricing example failed:", error);
    throw error;
  }
}

// Example 2: Cost estimation
export async function costEstimationExample() {
  try {
    console.log("=== Cost Estimation Example ===");

    const estimations = [];

    // Estimate TTS cost
    const ttsText = "Hello, this is a test of the ElevenLabs text-to-speech service. This text is about 100 characters long.";
    const ttsEstimate = pricingManager.estimateCost('text_to_speech', {
      text_length: ttsText.length,
      model: 'eleven_multilingual_v2'
    });
    console.log(`\nTTS Estimation:`);
    console.log(`  Text: "${ttsText}"`);
    console.log(`  Length: ${ttsText.length} characters`);
    console.log(`  Credits: ${ttsEstimate.credits}`);
    console.log(`  Cost: $${ttsEstimate.cost_usd.toFixed(4)}`);
    estimations.push({ service: 'text_to_speech', estimate: ttsEstimate });

    // Estimate music generation cost
    const musicEstimate = pricingManager.estimateCost('music_generation', {
      duration_ms: 60000 // 1 minute
    });
    console.log(`\nMusic Estimation:`);
    console.log(`  Duration: 60 seconds (1 minute)`);
    console.log(`  Credits: ${musicEstimate.credits}`);
    console.log(`  Cost: $${musicEstimate.cost_usd.toFixed(4)}`);
    estimations.push({ service: 'music_generation', estimate: musicEstimate });

    // Estimate sound effects cost
    const soundEffectEstimate = pricingManager.estimateCost('sound_effects', {
      duration_seconds: 5
    });
    console.log(`\nSound Effects Estimation:`);
    console.log(`  Duration: 5 seconds`);
    console.log(`  Credits: ${soundEffectEstimate.credits}`);
    console.log(`  Cost: $${soundEffectEstimate.cost_usd.toFixed(4)}`);
    estimations.push({ service: 'sound_effects', estimate: soundEffectEstimate });

    // Estimate voice design cost
    const voiceDesignEstimate = pricingManager.estimateCost('voice_design', {});
    console.log(`\nVoice Design Estimation:`);
    console.log(`  Credits: ${voiceDesignEstimate.credits}`);
    console.log(`  Cost: $${voiceDesignEstimate.cost_usd.toFixed(4)}`);
    estimations.push({ service: 'voice_design', estimate: voiceDesignEstimate });

    return estimations;
  } catch (error) {
    console.error("Cost estimation example failed:", error);
    throw error;
  }
}

// Example 3: Credit calculations
export async function creditCalculationExample() {
  try {
    console.log("=== Credit Calculation Example ===");

    const calculations = [];

    // Calculate TTS credits
    const ttsText = "This is a longer text for testing credit calculations. It contains multiple sentences and should give us a good estimate of how many credits would be used for text-to-speech conversion.";
    const ttsCredits = pricingManager.calculateTTSCredits(ttsText, 'eleven_multilingual_v2');
    console.log(`\nTTS Credit Calculation:`);
    console.log(`  Text: "${ttsText}"`);
    console.log(`  Length: ${ttsText.length} characters`);
    console.log(`  Credits: ${ttsCredits}`);
    calculations.push({ service: 'text_to_speech', credits: ttsCredits });

    // Calculate music credits
    const musicDurations = [10000, 30000, 60000, 120000, 300000]; // 10s, 30s, 1m, 2m, 5m
    console.log(`\nMusic Credit Calculations:`);
    musicDurations.forEach(duration => {
      const credits = pricingManager.calculateMusicCredits(duration);
      const minutes = duration / 60000;
      console.log(`  ${minutes} minutes (${duration}ms): ${credits} credits`);
      calculations.push({ service: 'music_generation', duration, credits });
    });

    // Calculate sound effect credits
    const soundEffectDurations = [1, 3, 5, 10, 30]; // seconds
    console.log(`\nSound Effect Credit Calculations:`);
    soundEffectDurations.forEach(duration => {
      const credits = pricingManager.calculateSoundEffectCredits(duration);
      console.log(`  ${duration} seconds: ${credits} credits`);
      calculations.push({ service: 'sound_effects', duration, credits });
    });

    // Calculate voice design credits
    const voiceDesignCredits = pricingManager.calculateVoiceDesignCredits();
    console.log(`\nVoice Design Credit Calculation:`);
    console.log(`  Credits: ${voiceDesignCredits}`);
    calculations.push({ service: 'voice_design', credits: voiceDesignCredits });

    return calculations;
  } catch (error) {
    console.error("Credit calculation example failed:", error);
    throw error;
  }
}

// Example 4: Cost calculations with different plans
export async function planComparisonExample() {
  try {
    console.log("=== Plan Comparison Example ===");

    const testCredits = [10000, 50000, 100000, 500000, 1000000, 5000000];
    const plans = pricingManager.getAllPlans().filter(plan => plan.name !== 'Enterprise');

    console.log("\n--- Cost Comparison for Different Credit Usage ---");
    console.log("Credits".padEnd(10) + "Free".padEnd(15) + "Starter".padEnd(15) + "Creator".padEnd(15) + "Pro".padEnd(15) + "Scale".padEnd(15) + "Business");
    console.log("-".repeat(100));

    testCredits.forEach(credits => {
      const costs = plans.map(plan => {
        const calculation = pricingManager.calculateCost(credits, plan);
        return `$${calculation.total_cost.toFixed(2)}`;
      });

      console.log(
        credits.toLocaleString().padEnd(10) +
        costs[0].padEnd(15) +
        costs[1].padEnd(15) +
        costs[2].padEnd(15) +
        costs[3].padEnd(15) +
        costs[4].padEnd(15) +
        costs[5]
      );
    });

    // Find most cost-effective plan for each credit amount
    console.log("\n--- Most Cost-Effective Plan for Each Credit Amount ---");
    testCredits.forEach(credits => {
      const recommendedPlan = pricingManager.getRecommendedPlan(credits);
      const calculation = pricingManager.calculateCost(credits, recommendedPlan);
      console.log(`${credits.toLocaleString()} credits: ${recommendedPlan.name} ($${calculation.total_cost.toFixed(2)})`);
    });

    return {
      testCredits,
      plans,
      recommendations: testCredits.map(credits => ({
        credits,
        recommendedPlan: pricingManager.getRecommendedPlan(credits),
        cost: pricingManager.calculateCost(credits, pricingManager.getRecommendedPlan(credits))
      }))
    };
  } catch (error) {
    console.error("Plan comparison example failed:", error);
    throw error;
  }
}

// Example 5: Usage tracking simulation
export async function usageTrackingExample() {
  try {
    console.log("=== Usage Tracking Example ===");

    // Simulate usage for different users and services
    const simulatedUsage = [
      {
        service: 'text_to_speech',
        user_id: 'user_1',
        session_id: 'session_1',
        credits_used: 150,
        details: {
          text_length: 150,
          model_used: 'eleven_multilingual_v2',
          voice_id: 'voice_1'
        }
      },
      {
        service: 'music_generation',
        user_id: 'user_1',
        session_id: 'session_1',
        credits_used: 4000,
        details: {
          music_length_ms: 120000,
          model_used: 'eleven_music'
        }
      },
      {
        service: 'text_to_speech',
        user_id: 'user_2',
        session_id: 'session_2',
        credits_used: 300,
        details: {
          text_length: 300,
          model_used: 'eleven_flash_v2_5',
          voice_id: 'voice_2'
        }
      },
      {
        service: 'sound_effects',
        user_id: 'user_2',
        session_id: 'session_2',
        credits_used: 500,
        details: {
          sound_effect_duration: 5
        }
      },
      {
        service: 'voice_design',
        user_id: 'user_3',
        session_id: 'session_3',
        credits_used: 1000,
        details: {
          model_used: 'eleven_multilingual_ttv_v2'
        }
      }
    ];

    // Record usage
    console.log("\n--- Recording Usage ---");
    const usageRecords = [];
    for (const usage of simulatedUsage) {
      const record = pricingManager.recordUsage(usage);
      usageRecords.push(record);
      console.log(`Recorded: ${usage.service} for ${usage.user_id} - ${usage.credits_used} credits`);
    }

    // Get usage summary
    console.log("\n--- Usage Summary ---");
    const summary = pricingManager.getUsageSummary();
    console.log(`Total Credits Used: ${summary.total_credits.toLocaleString()}`);
    console.log(`Total Cost: $${summary.total_cost.toFixed(4)}`);
    console.log(`Service Breakdown:`);
    Object.entries(summary.service_breakdown).forEach(([service, data]) => {
      console.log(`  ${service}: ${data.credits} credits, $${data.cost.toFixed(4)}, ${data.count} requests`);
    });

    // Get usage by user
    console.log("\n--- Usage by User ---");
    const user1Usage = pricingManager.getUsageSummary({ user_id: 'user_1' });
    console.log(`User 1: ${user1Usage.total_credits} credits, $${user1Usage.total_cost.toFixed(4)}`);

    const user2Usage = pricingManager.getUsageSummary({ user_id: 'user_2' });
    console.log(`User 2: ${user2Usage.total_credits} credits, $${user2Usage.total_cost.toFixed(4)}`);

    const user3Usage = pricingManager.getUsageSummary({ user_id: 'user_3' });
    console.log(`User 3: ${user3Usage.total_credits} credits, $${user3Usage.total_cost.toFixed(4)}`);

    // Get usage by service
    console.log("\n--- Usage by Service ---");
    const ttsUsage = pricingManager.getUsageSummary({ service: 'text_to_speech' });
    console.log(`Text to Speech: ${ttsUsage.total_credits} credits, $${ttsUsage.total_cost.toFixed(4)}`);

    const musicUsage = pricingManager.getUsageSummary({ service: 'music_generation' });
    console.log(`Music Generation: ${musicUsage.total_credits} credits, $${musicUsage.total_cost.toFixed(4)}`);

    return {
      usageRecords,
      summary,
      userUsage: {
        user_1: user1Usage,
        user_2: user2Usage,
        user_3: user3Usage
      },
      serviceUsage: {
        text_to_speech: ttsUsage,
        music_generation: musicUsage
      }
    };
  } catch (error) {
    console.error("Usage tracking example failed:", error);
    throw error;
  }
}

// Example 6: Real-world usage scenarios
export async function realWorldUsageScenarios() {
  try {
    console.log("=== Real-World Usage Scenarios ===");

    const scenarios = [];

    // Scenario 1: Podcast production
    console.log("\n--- Scenario 1: Podcast Production ---");
    const podcastText = "Welcome to our weekly podcast. Today we're discussing the latest trends in artificial intelligence and how they're shaping the future of technology. This episode is approximately 30 minutes long and covers various topics including machine learning, natural language processing, and computer vision.";
    const podcastCredits = pricingManager.calculateTTSCredits(podcastText);
    const podcastCost = pricingManager.calculateCost(podcastCredits);
    console.log(`Podcast Script: ${podcastText.length} characters`);
    console.log(`Credits: ${podcastCredits}`);
    console.log(`Cost: $${podcastCost.total_cost.toFixed(4)}`);
    scenarios.push({
      scenario: 'Podcast Production',
      credits: podcastCredits,
      cost: podcastCost
    });

    // Scenario 2: Video game soundtrack
    console.log("\n--- Scenario 2: Video Game Soundtrack ---");
    const gameMusicDurations = [30000, 60000, 120000, 180000]; // 30s, 1m, 2m, 3m
    let totalGameCredits = 0;
    gameMusicDurations.forEach(duration => {
      const credits = pricingManager.calculateMusicCredits(duration);
      totalGameCredits += credits;
      console.log(`${duration / 1000}s track: ${credits} credits`);
    });
    const gameCost = pricingManager.calculateCost(totalGameCredits);
    console.log(`Total Game Soundtrack: ${totalGameCredits} credits, $${gameCost.total_cost.toFixed(4)}`);
    scenarios.push({
      scenario: 'Video Game Soundtrack',
      credits: totalGameCredits,
      cost: gameCost
    });

    // Scenario 3: E-learning course
    console.log("\n--- Scenario 3: E-learning Course ---");
    const courseModules = [
      "Introduction to Machine Learning",
      "Supervised Learning Algorithms",
      "Unsupervised Learning Techniques",
      "Neural Networks and Deep Learning",
      "Model Evaluation and Validation"
    ];
    let totalCourseCredits = 0;
    courseModules.forEach((module, index) => {
      const moduleText = `Module ${index + 1}: ${module}. In this module, we will explore the fundamental concepts and practical applications of this topic. You will learn about the key algorithms, their strengths and weaknesses, and how to implement them in real-world scenarios.`;
      const credits = pricingManager.calculateTTSCredits(moduleText);
      totalCourseCredits += credits;
      console.log(`Module ${index + 1}: ${credits} credits`);
    });
    const courseCost = pricingManager.calculateCost(totalCourseCredits);
    console.log(`Total E-learning Course: ${totalCourseCredits} credits, $${courseCost.total_cost.toFixed(4)}`);
    scenarios.push({
      scenario: 'E-learning Course',
      credits: totalCourseCredits,
      cost: courseCost
    });

    // Scenario 4: Marketing campaign
    console.log("\n--- Scenario 4: Marketing Campaign ---");
    const marketingTexts = [
      "Introducing our revolutionary new product that will change the way you work.",
      "Experience the future of technology with our cutting-edge solutions.",
      "Join thousands of satisfied customers who have transformed their businesses.",
      "Limited time offer - get 50% off your first month subscription.",
      "Don't miss out on this incredible opportunity to upgrade your workflow."
    ];
    let totalMarketingCredits = 0;
    marketingTexts.forEach((text, index) => {
      const credits = pricingManager.calculateTTSCredits(text);
      totalMarketingCredits += credits;
      console.log(`Ad ${index + 1}: ${credits} credits`);
    });
    const marketingCost = pricingManager.calculateCost(totalMarketingCredits);
    console.log(`Total Marketing Campaign: ${totalMarketingCredits} credits, $${marketingCost.total_cost.toFixed(4)}`);
    scenarios.push({
      scenario: 'Marketing Campaign',
      credits: totalMarketingCredits,
      cost: marketingCost
    });

    // Scenario 5: Audiobook production
    console.log("\n--- Scenario 5: Audiobook Production ---");
    const audiobookChapters = 20;
    const avgChapterLength = 5000; // characters
    const totalAudiobookCredits = audiobookChapters * pricingManager.calculateTTSCredits('x'.repeat(avgChapterLength));
    const audiobookCost = pricingManager.calculateCost(totalAudiobookCredits);
    console.log(`Audiobook: ${audiobookChapters} chapters, ${avgChapterLength} chars each`);
    console.log(`Total: ${totalAudiobookCredits.toLocaleString()} credits, $${audiobookCost.total_cost.toFixed(2)}`);
    scenarios.push({
      scenario: 'Audiobook Production',
      credits: totalAudiobookCredits,
      cost: audiobookCost
    });

    return scenarios;
  } catch (error) {
    console.error("Real-world usage scenarios example failed:", error);
    throw error;
  }
}

// Example 7: Plan recommendations
export async function planRecommendationExample() {
  try {
    console.log("=== Plan Recommendation Example ===");

    const usageScenarios = [
      { name: 'Hobbyist', monthlyCredits: 5000 },
      { name: 'Small Business', monthlyCredits: 25000 },
      { name: 'Content Creator', monthlyCredits: 75000 },
      { name: 'Enterprise', monthlyCredits: 500000 },
      { name: 'Large Scale', monthlyCredits: 2000000 }
    ];

    console.log("\n--- Plan Recommendations ---");
    const recommendations = [];
    
    usageScenarios.forEach(scenario => {
      const recommendedPlan = pricingManager.getRecommendedPlan(scenario.monthlyCredits);
      const cost = pricingManager.calculateCost(scenario.monthlyCredits, recommendedPlan);
      
      console.log(`\n${scenario.name} (${scenario.monthlyCredits.toLocaleString()} credits/month):`);
      console.log(`  Recommended Plan: ${recommendedPlan.name}`);
      console.log(`  Monthly Cost: $${cost.total_cost.toFixed(2)}`);
      console.log(`  Cost per Credit: $${(cost.total_cost / scenario.monthlyCredits).toFixed(6)}`);
      
      if (cost.overage_credits) {
        console.log(`  Overage: ${cost.overage_credits.toLocaleString()} credits ($${cost.overage_cost?.toFixed(2)})`);
      }
      
      recommendations.push({
        scenario: scenario.name,
        monthlyCredits: scenario.monthlyCredits,
        recommendedPlan,
        cost
      });
    });

    return recommendations;
  } catch (error) {
    console.error("Plan recommendation example failed:", error);
    throw error;
  }
}

// Example 8: Export usage data
export async function exportUsageDataExample() {
  try {
    console.log("=== Export Usage Data Example ===");

    // First, let's add some usage data
    pricingManager.recordUsage({
      service: 'text_to_speech',
      user_id: 'demo_user',
      credits_used: 100,
      cost_usd: 0.01,
      details: { text_length: 100, model_used: 'eleven_multilingual_v2' }
    });

    pricingManager.recordUsage({
      service: 'music_generation',
      user_id: 'demo_user',
      credits_used: 2000,
      cost_usd: 0.20,
      details: { music_length_ms: 60000 }
    });

    // Export as JSON
    const jsonExport = pricingManager.exportUsageData('json');
    console.log("\n--- JSON Export ---");
    console.log(jsonExport);

    // Export as CSV
    const csvExport = pricingManager.exportUsageData('csv');
    console.log("\n--- CSV Export ---");
    console.log(csvExport);

    return {
      jsonExport,
      csvExport
    };
  } catch (error) {
    console.error("Export usage data example failed:", error);
    throw error;
  }
}

// Export all examples
export const pricingExamples = {
  basicPricingExample,
  costEstimationExample,
  creditCalculationExample,
  planComparisonExample,
  usageTrackingExample,
  realWorldUsageScenarios,
  planRecommendationExample,
  exportUsageDataExample
};
