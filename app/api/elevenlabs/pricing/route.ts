/**
 * ElevenLabs Pricing and Usage API Route
 * 
 * Server-side API endpoint for pricing information and usage tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { pricingManager } from '@/lib/elevenlabs/pricing-manager';
import { elevenLabsService } from '@/lib/elevenlabs/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const type = searchParams.get('type') || 'plans';
    const planName = searchParams.get('plan') || undefined;
    const service = searchParams.get('service') || undefined;
    const user_id = searchParams.get('user_id') || undefined;
    const start_date = searchParams.get('start_date') ? new Date(searchParams.get('start_date')!) : undefined;
    const end_date = searchParams.get('end_date') ? new Date(searchParams.get('end_date')!) : undefined;
    const monthly_credits = searchParams.get('monthly_credits') ? parseInt(searchParams.get('monthly_credits')!) : undefined;

    let result;

    switch (type) {
      case 'plans':
        result = pricingManager.getAllPlans();
        break;

      case 'current_plan':
        result = pricingManager.getCurrentPlan();
        break;

      case 'service_pricing':
        if (service) {
          result = pricingManager.getServicePricing(service);
        } else {
          result = pricingManager.getAllPlans().map(plan => ({
            plan: plan.name,
            cost: plan.cost,
            credits: plan.credits,
            features: plan.features
          }));
        }
        break;

      case 'usage_summary':
        result = pricingManager.getUsageSummary({
          user_id,
          service,
          start_date,
          end_date
        });
        break;

      case 'usage_records':
        result = pricingManager.getUsageRecords({
          user_id,
          service,
          start_date,
          end_date
        });
        break;

      case 'recommended_plan':
        if (monthly_credits) {
          result = pricingManager.getRecommendedPlan(monthly_credits);
        } else {
          result = { error: 'monthly_credits parameter is required' };
        }
        break;

      case 'cost_breakdown':
        const creditsUsed = parseInt(searchParams.get('credits_used') || '0');
        if (creditsUsed > 0) {
          result = pricingManager.calculateCost(creditsUsed, planName);
        } else {
          result = { error: 'credits_used parameter is required' };
        }
        break;

      default:
        // Return all pricing data
        result = {
          plans: pricingManager.getAllPlans(),
          current_plan: pricingManager.getCurrentPlan(),
          service_pricing: pricingManager.getAllPlans().map(plan => ({
            plan: plan.name,
            cost: plan.cost,
            credits: plan.credits,
            features: plan.features
          }))
        };
    }

    return NextResponse.json({
      success: true,
      data: result,
      query: { type, planName, service, user_id, start_date, end_date, monthly_credits }
    });

  } catch (error) {
    console.error('Pricing API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch pricing data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const action = body.action || 'estimate_cost';

    switch (action) {
      case 'estimate_cost':
        // Estimate cost for a request
        if (!body.service) {
          return NextResponse.json(
            { error: 'Service is required for cost estimation' },
            { status: 400 }
          );
        }

        const estimate = pricingManager.estimateCost(body.service, body.details || {});
        
        return NextResponse.json({
          success: true,
          action: 'estimate_cost',
          service: body.service,
          details: body.details,
          estimate
        });

      case 'calculate_tts_credits':
        // Calculate TTS credits
        if (!body.text) {
          return NextResponse.json(
            { error: 'Text is required for TTS credit calculation' },
            { status: 400 }
          );
        }

        const ttsCredits = pricingManager.calculateTTSCredits(body.text, body.model);
        
        return NextResponse.json({
          success: true,
          action: 'calculate_tts_credits',
          text: body.text,
          model: body.model,
          credits: ttsCredits
        });

      case 'calculate_music_credits':
        // Calculate music credits
        if (!body.duration_ms) {
          return NextResponse.json(
            { error: 'duration_ms is required for music credit calculation' },
            { status: 400 }
          );
        }

        const musicCredits = pricingManager.calculateMusicCredits(body.duration_ms);
        
        return NextResponse.json({
          success: true,
          action: 'calculate_music_credits',
          duration_ms: body.duration_ms,
          credits: musicCredits
        });

      case 'calculate_sound_effect_credits':
        // Calculate sound effect credits
        const soundEffectCredits = pricingManager.calculateSoundEffectCredits(body.duration_seconds);
        
        return NextResponse.json({
          success: true,
          action: 'calculate_sound_effect_credits',
          duration_seconds: body.duration_seconds,
          credits: soundEffectCredits
        });

      case 'calculate_voice_design_credits':
        // Calculate voice design credits
        const voiceDesignCredits = pricingManager.calculateVoiceDesignCredits();
        
        return NextResponse.json({
          success: true,
          action: 'calculate_voice_design_credits',
          credits: voiceDesignCredits
        });

      case 'calculate_cost':
        // Calculate total cost
        if (!body.credits_used) {
          return NextResponse.json(
            { error: 'credits_used is required for cost calculation' },
            { status: 400 }
          );
        }

        const costCalculation = pricingManager.calculateCost(body.credits_used, body.plan_name);
        
        return NextResponse.json({
          success: true,
          action: 'calculate_cost',
          credits_used: body.credits_used,
          plan_name: body.plan_name,
          cost_calculation: costCalculation
        });

      case 'set_plan':
        // Set pricing plan
        if (!body.plan_name) {
          return NextResponse.json(
            { error: 'plan_name is required to set plan' },
            { status: 400 }
          );
        }

        pricingManager.setPlan(body.plan_name);
        const newPlan = pricingManager.getCurrentPlan();
        
        return NextResponse.json({
          success: true,
          action: 'set_plan',
          plan_name: body.plan_name,
          current_plan: newPlan
        });

      case 'record_usage':
        // Record usage
        if (!body.service || !body.credits_used) {
          return NextResponse.json(
            { error: 'service and credits_used are required to record usage' },
            { status: 400 }
          );
        }

        const usageRecord = pricingManager.recordUsage({
          service: body.service,
          user_id: body.user_id,
          session_id: body.session_id,
          credits_used: body.credits_used,
          cost_usd: body.cost_usd || 0,
          details: body.details || {},
          metadata: body.metadata || {}
        });
        
        return NextResponse.json({
          success: true,
          action: 'record_usage',
          usage_record: usageRecord
        });

      case 'get_recommended_plan':
        // Get recommended plan
        if (!body.monthly_credits) {
          return NextResponse.json(
            { error: 'monthly_credits is required to get recommended plan' },
            { status: 400 }
          );
        }

        const recommendedPlan = pricingManager.getRecommendedPlan(body.monthly_credits);
        
        return NextResponse.json({
          success: true,
          action: 'get_recommended_plan',
          monthly_credits: body.monthly_credits,
          recommended_plan: recommendedPlan
        });

      case 'export_usage_data':
        // Export usage data
        const format = body.format || 'json';
        const exportData = pricingManager.exportUsageData(format);
        
        return NextResponse.json({
          success: true,
          action: 'export_usage_data',
          format,
          data: exportData
        });

      case 'clear_usage_records':
        // Clear usage records
        pricingManager.clearUsageRecords();
        
        return NextResponse.json({
          success: true,
          action: 'clear_usage_records',
          message: 'Usage records cleared successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: estimate_cost, calculate_tts_credits, calculate_music_credits, calculate_sound_effect_credits, calculate_voice_design_credits, calculate_cost, set_plan, record_usage, get_recommended_plan, export_usage_data, clear_usage_records' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Pricing processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process pricing request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
