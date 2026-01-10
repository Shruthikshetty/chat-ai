// util used to fetch ollama models
export const getOllamaTags = async () => {
  return fetch("http://localhost:11434/api/tags")
    .then((res) => res.json())
    .then((data) => data.models);
};
