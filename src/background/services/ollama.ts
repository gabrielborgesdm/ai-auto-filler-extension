class Ollama {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl;
    this.model = model;
    console.log("[OLLAMA] baseUrl:", this.baseUrl);
    console.log("[OLLAMA] model:", this.model);
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

  getAutoFillPrompt(input: string, parent: string, context?: string): string {
    let prompt = `
    You are an intelligent form autofill agent.

    You will receive a serialized HTML input element (inputNode) and its parent container (parentNode), along with optional context. Your task is to infer the appropriate value for the input field, either from the context or through your best reasoning based on field names, labels, and structure.

    Respond ONLY with the value to autofill. Do not include explanations.

    Do not use examples from the placeholders to return the response.

    ### Parent Node:
    ${parent}

    ### Input Node:
    ${input}

    ### Context:
    ${context ? context : "No context provided."}

    What is the appropriate value to autofill?
`;

    console.log("[OLLAMA] Prompt:", prompt);
    return prompt;
  }
}

export default Ollama;
