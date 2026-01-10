import { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import { KokoroTTS } from "kokoro-js";

export function useKokoro() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    if (!workerRef.current) {
      // Create worker using the URL constructor for Vite support
      workerRef.current = new Worker(
        new URL("../workers/tts.worker.ts", import.meta.url),
        {
          type: "module",
        }
      );

      workerRef.current.onmessage = async (e: MessageEvent) => {
        const { type, error: errMsg, audio, sampleRate } = e.data;

        if (type === "READY") {
          console.log("Worker reported ready");
          setIsLoading(false);
        } else if (type === "ERROR") {
          console.error("Worker error:", errMsg);
          setError(errMsg);
          setIsLoading(false);
          setIsSpeaking(false);
        } else if (type === "AUDIO_DATA") {
          console.log("Received audio from worker");
          await playAudio(audio, sampleRate);
        }
      };

      workerRef.current.postMessage({ type: "INIT" });
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  const playAudio = async (audioData: Float32Array, sampleRate: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const audioBuffer = ctx.createBuffer(1, audioData.length, sampleRate);
      audioBuffer.getChannelData(0).set(audioData);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      source.onended = () => {
        console.log("Audio playback finished");
        setIsSpeaking(false);
        sourceRef.current = null;
      };

      // Stop previous if exists
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch (e) {}
      }

      sourceRef.current = source;
      source.start();
      console.log("Audio playback started");
    } catch (err) {
      console.error("Playback error:", err);
      setIsSpeaking(false);
    }
  };

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) {
        console.warn("Error stopping audio source:", e);
      }
      sourceRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (isLoading) {
        console.warn("Model still loading");
        return;
      }
      stop();
      setIsSpeaking(true);
      console.log("Sending text to worker:", text.slice(0, 20));
      workerRef.current?.postMessage({ type: "GENERATE", text });
    },
    [isLoading, stop]
  );

  return { speak, stop, isLoading, isSpeaking, error };
}
