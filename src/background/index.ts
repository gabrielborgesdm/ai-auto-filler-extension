import { fillInput, startObservingInputClick } from "./cases/dom";
import Ollama from "./cases/ollama";
import { injectScriptAsync } from "./cases/script";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("[CRXJS] Message received:", request);
  if (request.action === "startObserving") {
    console.log("[CRXJS] Starting observation...");
    console.log("[CRXJS] Tab:", request.tabId);
    sendResponse({ status: "Observing clicks" });

    // retrieves the element and parent from the page
    const element = await injectScriptAsync<{
      inputUuid: string;
      element: string;
      parent: string;
    }>(request.tabId, startObservingInputClick);

    // initializes the ollama client to generate the response
    const ollama = new Ollama(
      import.meta.env.VITE_OLLAMA_URL,
      import.meta.env.VITE_OLLAMA_MODEL
    );
    console.log("[CRXJS] Element:", element);

    const context = await chrome.storage.sync
      .get("formFields")
      .then((result) =>
        result.formFields
          .map((field: any) => `${field.name}: ${field.value}`)
          .join("\n")
      );
    console.log("[CRXJS] Context:", context);

    try {
      const response = await ollama.generate(
        ollama.getAutoFillPrompt(
          element.element,
          element.parent,
          `
          ${context}
          `
        )
      );
      console.log("[CRXJS] ollama Response:", response);

      if (response) {
        // injects the response into the page
        await injectScriptAsync(
          request.tabId,
          fillInput,
          element.inputUuid,
          response
        );
      }
    } catch (error) {
      console.error("[CRXJS] Error generating response:", error);
    }
  }

  return true;
});
