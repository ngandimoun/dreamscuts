import Replicate from "replicate";

export interface Gen4ImageInput {
  prompt: string;
  seed?: number;
  resolution?: "720p" | "1080p";
  aspect_ratio?: "16:9" | "9:16" | "4:3" | "3:4" | "1:1" | "21:9";
  reference_tags?: string[];
  reference_images?: string[];
}

export interface Gen4ImageOutput {
  url: string;
}

export class ReplicateRunwayGen4ImageExecutor {
  private modelId = "runwayml/gen4-image";
  private replicate: Replicate;

  constructor() {
    this.replicate = new Replicate();
  }

  async generate(input: Gen4ImageInput): Promise<Gen4ImageOutput> {
    const params = {
      prompt: input.prompt,
      seed: input.seed,
      resolution: input.resolution ?? "1080p",
      aspect_ratio: input.aspect_ratio ?? "16:9",
      reference_tags: input.reference_tags,
      reference_images: input.reference_images
    };

    const output = await this.replicate.run(this.modelId, {
      input: params
    });

    return { url: output as string };
  }

  getCostEstimate(resolution: "720p" | "1080p" = "1080p") {
    return resolution === "720p" 
      ? { price: 0.05, unit: "per image", bulkDiscount: "20 images for $1" }
      : { price: 0.08, unit: "per image", bulkDiscount: "12 images for $1" };
  }

  validateInput(input: Gen4ImageInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.prompt) {
      errors.push("prompt is required");
    }

    if (input.reference_images && input.reference_images.length > 3) {
      errors.push("Maximum of 3 reference images allowed");
    }

    return { valid: errors.length === 0, errors };
  }
}

export const replicateRunwayGen4Image = new ReplicateRunwayGen4ImageExecutor();
