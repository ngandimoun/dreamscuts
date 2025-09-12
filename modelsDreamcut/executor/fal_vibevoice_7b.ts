import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/vibevoice/7b", {
  input: {
    script: "Speaker 0: VibeVoice is now available on Fal. Isn't that right, Carter?\nSpeaker 1: That's right Frank, and it supports up to four speakers at once. Try it now!",
    speakers: [{
      preset: "Frank [EN]"
    }, {
      preset: "Carter [EN]"
    }]
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);