import Ollama from "@/background/services/ollama";
import { describe, expect, it } from "vitest";

describe("OllamaService", () => {
  // The idea is to test if the contextual search is working

  const context = `My name is Gabriel John Doe and my e-mail is gabriel@email.com`;
  const ollamaService = new Ollama(
    process.env.VITE_OLLAMA_URL!,
    process.env.VITE_OLLAMA_MODEL!
  );

  it("should test the autofill prompt", async () => {
    const question = "What is the email address?";
    const prompt = ollamaService.getAutoFillPrompt(question, context);
    const response = await ollamaService.generate(prompt);
    console.log(response);
    console.log("-------------------------\n");

    // Basic assertion to ensure the function runs and returns a string
    expect(typeof response).toBe("string");
    // You can add more specific assertions here based on expected content
    expect(response).toContain("gabriel@email.com");
  }, 60000); // Increase timeout for model loading and processing

  it("should test the input question prompt", async () => {
    const inputNode = `<input placeholder="hello@example.com..." name="_systemfield_email" required="" id="_systemfield_email" type="email" class="_input_1wkz4_28 _input_hkyf8_33" value="">`;
    const parentNode = `<div class="_fieldEntry_hkyf8_29 ashby-application-form-field-entry"><label class="_heading_101oc_53 _required_101oc_92 _label_hkyf8_43 ashby-application-form-question-title" for="_systemfield_email">Email</label><input placeholder="hello@example.com..." name="_systemfield_email" required="" id="_systemfield_email" type="email" class="_input_1wkz4_28 _input_hkyf8_33" value=""></div>`;

    const prompt = ollamaService.getInputQuestionPrompt(inputNode, parentNode);
    const response = await ollamaService.generate(prompt);
    console.log(response);
    console.log("-------------------------\n");

    // Basic assertion to ensure the function runs and returns a string
    expect(typeof response).toBe("string");
    // You can add more specific assertions here based on expected content
    expect(response.toLowerCase()).toContain("email");
  }, 60000); // Increase timeout for model loading and processing
});
