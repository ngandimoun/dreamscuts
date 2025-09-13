import Replicate from "replicate";

export interface FaceToStickerInput {
  image: string;
  prompt?: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  prompt_strength?: number;
  instant_id_strength?: number;
  ip_adapter_weight?: number;
  ip_adapter_noise?: number;
  upscale?: boolean;
  upscale_steps?: number;
}

export interface FaceToStickerOutput {
  urls: string[];
}

export class ReplicateFofrFaceToStickerExecutor {
  private modelId = "fofr/face-to-sticker:764d4827ea159608a07cdde8ddf1c6000019627515eb02b6b449695fd547e5ef";
  private replicate: Replicate;

  constructor() {
    this.replicate = new Replicate();
  }

  async generate(input: FaceToStickerInput): Promise<FaceToStickerOutput> {
    const params = {
      image: input.image,
      prompt: input.prompt ?? "a person",
      negative_prompt: input.negative_prompt ?? "",
      width: input.width ?? 1024,
      height: input.height ?? 1024,
      steps: input.steps ?? 20,
      seed: input.seed,
      prompt_strength: input.prompt_strength ?? 7,
      instant_id_strength: input.instant_id_strength ?? 1,
      ip_adapter_weight: input.ip_adapter_weight ?? 0.2,
      ip_adapter_noise: input.ip_adapter_noise ?? 0.5,
      upscale: input.upscale ?? false,
      upscale_steps: input.upscale_steps ?? 10
    };

    const output = await this.replicate.run(this.modelId, {
      input: params
    });

    return { urls: output as string[] };
  }

  getCostEstimate(): { price: number; unit: string; bulkDiscount: string } {
    return {
      price: 0.021,
      unit: "per run",
      bulkDiscount: "47 runs for $1"
    };
  }

  validateInput(input: FaceToStickerInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.image) {
      errors.push("image is required");
    }

    if (input.width && (input.width < 512 || input.width > 2048)) {
      errors.push("width must be between 512 and 2048");
    }

    if (input.height && (input.height < 512 || input.height > 2048)) {
      errors.push("height must be between 512 and 2048");
    }

    if (input.steps && (input.steps < 1 || input.steps > 50)) {
      errors.push("steps must be between 1 and 50");
    }

    if (input.prompt_strength && (input.prompt_strength < 0 || input.prompt_strength > 20)) {
      errors.push("prompt_strength must be between 0 and 20");
    }

    if (input.instant_id_strength && (input.instant_id_strength < 0 || input.instant_id_strength > 1)) {
      errors.push("instant_id_strength must be between 0 and 1");
    }

    if (input.ip_adapter_weight && (input.ip_adapter_weight < 0 || input.ip_adapter_weight > 1)) {
      errors.push("ip_adapter_weight must be between 0 and 1");
    }

    if (input.ip_adapter_noise && (input.ip_adapter_noise < 0 || input.ip_adapter_noise > 1)) {
      errors.push("ip_adapter_noise must be between 0 and 1");
    }

    if (input.upscale_steps && (input.upscale_steps < 1 || input.upscale_steps > 20)) {
      errors.push("upscale_steps must be between 1 and 20");
    }

    return { valid: errors.length === 0, errors };
  }

  getProcessingTimeEstimate(): { time: string; category: string } {
    return { time: "22 seconds", category: "fast" };
  }

  getAttributionRequirements(): { required: boolean; text: string; link: string } {
    return {
      required: true,
      text: "Powered by Fofr AI",
      link: "https://twitter.com/fofrAI"
    };
  }
}

export const replicateFofrFaceToSticker = new ReplicateFofrFaceToStickerExecutor();
