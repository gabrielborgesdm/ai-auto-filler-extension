import { Logger } from "@/utils/logger";

class Ollama {
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly logger: Logger;

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.logger = new Logger("ollama");
    this.logger.log("baseUrl:", this.baseUrl);
    this.logger.log("model:", this.model);
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API returned ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();
    return data.response;
  }

  getAutoFillPrompt(question: string, context?: string): string {
    const prompt = `
      You are an intelligent form autofill agent.

      You will be provided with a **natural language question** and a **context**. Your sole task is to infer and extract the most appropriate value to autofill for the question from the provided context.

      Respond **ONLY** with the extracted value. Do not include any explanations, greetings, or additional text.
      If the appropriate value cannot be confidently inferred from the given context, respond with **"N/A"**.
      Do not use placeholder examples (e.g., values present in the question format itself) as actual autofill responses.

      ### Question:
      ${question}

      ### Context:
      ${context ? context : "No context provided."}
    `;
    this.logger.log("[OLLAMA] Prompt:", prompt);
    return prompt;
  }

  getInputQuestionPrompt(input: string, parent: string): string {
    const prompt = `
      From the provided HTML parent node and input node, extract the most relevant and concise **natural language query** that describes the intended content or purpose of the input field. Prioritize explicit labels, then semantic field names, and finally structural cues. Respond ONLY with this descriptive query.

      ### Parent Node:
      ${parent}

      ### Input Node:
      ${input}
    `;
    this.logger.log("Input Question Prompt:", prompt);
    return prompt;
  }
}

export default Ollama;
