/**
 * Replicate BLIP Executor
 * 
 * Salesforce BLIP model for image captioning and visual question answering.
 * Excellent for generating natural language descriptions of images.
 * 
 * Model: salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746
 */

import Replicate from "replicate";

export interface ReplicateBLIPInput {
  image: string; // URL or base64 encoded image
  task?: 'image_captioning' | 'visual_question_answering';
  question?: string; // Required for VQA task
  caption?: string; // Optional for captioning task
}

export interface ReplicateBLIPOutput {
  caption?: string;
  answer?: string;
  processing_time?: number;
}

export interface ReplicateBLIPOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: any) => void;
}

/**
 * Execute Replicate BLIP model for image analysis
 */
export async function executeReplicateBLIP(
  input: ReplicateBLIPInput,
  options: ReplicateBLIPOptions = {}
): Promise<ReplicateBLIPOutput> {
  try {
    // Validate API token
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN environment variable is required');
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Validate required inputs
    if (!input.image || input.image.trim().length === 0) {
      throw new Error('Image URL or data is required');
    }

    // Set default task
    const task = input.task || 'image_captioning';

    // Validate task-specific requirements
    if (task === 'visual_question_answering' && (!input.question || input.question.trim().length === 0)) {
      throw new Error('Question is required for visual question answering task');
    }

    // Prepare the request payload
    const payload: any = {
      image: input.image.trim(),
      task: task,
    };

    if (task === 'visual_question_answering' && input.question) {
      payload.question = input.question.trim();
    }

    if (task === 'image_captioning' && input.caption) {
      payload.caption = input.caption.trim();
    }

    console.log(`[Replicate-BLIP] Executing ${task} for image`);

    const startTime = Date.now();

    // Execute the model
    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: payload,
      }
    );

    const processingTime = Date.now() - startTime;

    // Process the output
    const responseText = Array.isArray(output) ? output.join("") : String(output);

    console.log(`[Replicate-BLIP] Generated response in ${processingTime}ms`);

    // Return appropriate response based on task
    const result: ReplicateBLIPOutput = {
      processing_time: processingTime
    };

    if (task === 'image_captioning') {
      result.caption = responseText.trim();
    } else if (task === 'visual_question_answering') {
      result.answer = responseText.trim();
    }

    return result;

  } catch (error) {
    console.error('[Replicate-BLIP] Execution failed:', error);
    throw new Error(`Replicate BLIP execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to create comprehensive image analysis using BLIP
 */
export async function comprehensiveImageAnalysisWithBLIP(
  imageUrl: string,
  options: ReplicateBLIPOptions = {}
): Promise<{
  caption: string;
  objectAnalysis: string;
  sceneAnalysis: string;
  qualityAssessment: string;
  processingTime: number;
}> {
  try {
    const startTime = Date.now();

    // Run multiple analysis tasks in parallel
    const [
      captionResult,
      objectResult,
      sceneResult,
      qualityResult
    ] = await Promise.all([
      // Basic image captioning
      executeReplicateBLIP({
        image: imageUrl,
        task: 'image_captioning'
      }, options),

      // Object analysis
      executeReplicateBLIP({
        image: imageUrl,
        task: 'visual_question_answering',
        question: 'What objects and items can you see in this image? List them in detail.'
      }, options),

      // Scene analysis
      executeReplicateBLIP({
        image: imageUrl,
        task: 'visual_question_answering',
        question: 'Describe the setting, environment, and overall scene of this image.'
      }, options),

      // Quality assessment
      executeReplicateBLIP({
        image: imageUrl,
        task: 'visual_question_answering',
        question: 'Assess the technical quality of this image including clarity, lighting, composition, and overall visual appeal.'
      }, options),
    ]);

    const totalProcessingTime = Date.now() - startTime;

    return {
      caption: captionResult.caption || '',
      objectAnalysis: objectResult.answer || '',
      sceneAnalysis: sceneResult.answer || '',
      qualityAssessment: qualityResult.answer || '',
      processingTime: totalProcessingTime
    };

  } catch (error) {
    console.error('[BLIP-Comprehensive-Analysis] Failed:', error);
    throw new Error(`BLIP comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Predefined questions for different analysis types
 */
export const BLIP_ANALYSIS_QUESTIONS = {
  objects: 'What objects, items, and elements can you see in this image? Provide a detailed list.',
  people: 'Are there any people in this image? If so, describe them and what they are doing.',
  scene: 'Describe the setting, location, and environment shown in this image.',
  colors: 'What are the dominant colors and color scheme of this image?',
  mood: 'What mood, atmosphere, or feeling does this image convey?',
  quality: 'Assess the technical quality of this image including resolution, clarity, and composition.',
  style: 'What visual style, aesthetic, or artistic approach does this image represent?',
  text: 'Is there any text, writing, or signage visible in this image? If so, what does it say?',
  lighting: 'Describe the lighting conditions and how light affects the image.',
  composition: 'Analyze the composition, framing, and visual arrangement of elements in this image.'
} as const;

/**
 * Helper function to estimate processing cost for BLIP
 */
export function estimateBLIPCost(numberOfQueries: number): number {
  // Replicate pricing for BLIP (approximate)
  const costPerRun = 0.0023; // $0.0023 per run
  
  return numberOfQueries * costPerRun;
}

/**
 * Helper function to batch analyze images with multiple questions
 */
export async function batchImageAnalysisWithBLIP(
  imageUrl: string,
  questions: string[],
  options: ReplicateBLIPOptions = {}
): Promise<{
  results: Array<{ question: string; answer: string }>;
  caption: string;
  totalProcessingTime: number;
}> {
  try {
    const startTime = Date.now();

    // First get the basic caption
    const captionResult = await executeReplicateBLIP({
      image: imageUrl,
      task: 'image_captioning'
    }, options);

    // Then run all questions in parallel
    const questionPromises = questions.map(question =>
      executeReplicateBLIP({
        image: imageUrl,
        task: 'visual_question_answering',
        question: question
      }, options).then(result => ({
        question,
        answer: result.answer || ''
      }))
    );

    const questionResults = await Promise.all(questionPromises);
    const totalProcessingTime = Date.now() - startTime;

    return {
      results: questionResults,
      caption: captionResult.caption || '',
      totalProcessingTime
    };

  } catch (error) {
    console.error('[BLIP-Batch-Analysis] Failed:', error);
    throw new Error(`BLIP batch analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default executeReplicateBLIP;
