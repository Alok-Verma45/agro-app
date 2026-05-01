import API from "./axios";

export const askAI = (prompt) =>
  API.post("/ai/chat", { prompt });