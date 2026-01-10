// hook used to manage ollama models

import { getOllamaTags } from "@/lib/ollama";
import { Model } from "@/lib/types";
import { useEffect, useState } from "react";

export const useOllamaModels = () => {
  const [availableModels, setAvailableModels] = useState<Model[]>([]);

  // fetch available models from ollama
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getOllamaTags();
        const models: Model[] = (data || []).map((model: any) => ({
          id: model.model,
          name: model.name,
          description: `Size: ${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB`,
          tags: model.details ? [model.details.family] : [],
        }));
        setAvailableModels(models);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    fetchModels();
  }, []);

  return { availableModels };
};
