import { KokoroTTS } from "kokoro-js";

// Define message types
type WorkerMessage =
  | { type: "INIT" }
  | { type: "GENERATE"; text: string; voice?: string };

type WorkerResponse =
  | { type: "READY" }
  | { type: "ERROR"; error: string }
  | {
      type: "AUDIO_DATA";
      audio: Float32Array;
      sampleRate: number;
      text: string;
    };

let model: any = null;

// Initialize model
async function initModel() {
  try {
    console.log("Worker: Loading Kokoro TTS model...");
    // @ts-ignore
    model = await KokoroTTS.from_pretrained(
      "onnx-community/Kokoro-82M-v1.0-ONNX",
      {
        dtype: "q8",
      }
    );
    console.log("Worker: Kokoro TTS model loaded successfully");
    self.postMessage({ type: "READY" } as WorkerResponse);
  } catch (err: any) {
    console.error("Worker: Failed to load Kokoro:", err);
    self.postMessage({
      type: "ERROR",
      error: err.message || "Failed to load model",
    } as WorkerResponse);
  }
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type } = e.data;

  if (type === "INIT") {
    if (!model) {
      await initModel();
    } else {
      self.postMessage({ type: "READY" } as WorkerResponse);
    }
  } else if (type === "GENERATE") {
    const { text, voice = "af_bella" } = e.data as {
      type: "GENERATE";
      text: string;
      voice?: string;
    };

    if (!model) {
      self.postMessage({
        type: "ERROR",
        error: "Model not loaded",
      } as WorkerResponse);
      return;
    }

    try {
      console.log("Worker: Generating audio for:", text.slice(0, 20) + "...");
      const result = await model.generate(text, { voice });

      let audioData: Float32Array;
      let sampleRate = 24000;

      if (result.audio) {
        audioData = result.audio;
        if (result.sampling_rate) sampleRate = result.sampling_rate;
      } else if (result instanceof Float32Array) {
        audioData = result;
      } else {
        throw new Error("Unknown audio format");
      }

      // Transfer the buffer to avoid copying if possible (though Float32Array view needs its buffer)
      // @ts-ignore
      self.postMessage(
        {
          type: "AUDIO_DATA",
          audio: audioData,
          sampleRate,
          text,
        } as WorkerResponse,
        [audioData.buffer]
      );
    } catch (err: any) {
      console.error("Worker: Generation failed:", err);
      self.postMessage({
        type: "ERROR",
        error: err.message || "Generation failed",
      } as WorkerResponse);
    }
  }
};
