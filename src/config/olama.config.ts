import { createOllama } from "ollama-ai-provider-v2";

//initialize the ollama provider
const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

export { ollama };
