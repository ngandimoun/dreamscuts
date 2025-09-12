import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/vibevoice/7b", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});
console.log(result.data);
console.log(result.requestId);