import { EventKeys } from "@/events-keys";
import { InputAutoFillResponse, InputData } from "@/types/Input";
import FieldsStorage from "@/utils/fields-storage";
import { Logger } from "@/utils/logger";
import Message from "@/utils/message";
import Ollama from "@/background/services/ollama";
import { RagService } from "./services/rag";

const logger = new Logger("background");

async function parseClickedInput(tabId: number, payload: InputData) {
  logger.log("Parsing clicked input", payload);
  // Initialize Ollama
  const ollama = new Ollama(
    import.meta.env.VITE_OLLAMA_URL,
    import.meta.env.VITE_OLLAMA_MODEL
  );

  // Get the fields from storage and create a context
  const result = await FieldsStorage.getFields();
  const additionalDynamicContext = result
    ?.map((field) => `${field.name}: ${field.value}`)
    .join("\n");

  logger.log("Additional Dynamic Context:", additionalDynamicContext);

  try {
    // Generate the natural language query for the input
    const query = await ollama.generate(
      ollama.getInputQuestionPrompt(payload.element, payload.parent)
    );
    logger.log("Query:", query);

    // Get the context from the documents
    const context = await new RagService().getContext(
      undefined,
      additionalDynamicContext,
      query
    );

    logger.log("Context:", context);

    // Generate the autofill response
    logger.log("Generating autofill response");
    const response = await ollama.generate(
      ollama.getAutoFillPrompt(query, context)
    );
    logger.log("Response:", response);

    if (!response) {
      throw new Error("Could not autofill");
    }

    // Send message to content script to fill the input
    return Message.sendTabMessage(tabId, EventKeys.content_ProcessedElement, {
      inputUuid: payload.inputUuid,
      value: response,
    } as InputAutoFillResponse);
  } catch (error) {
    logger.error("Error generating response:", error);
  }
}

Message.listen(({ tabId, action, payload }) => {
  // Receives from the popup and sends to the content script
  if (action === EventKeys.background_StartedAutoFill) {
    Message.sendTabMessage(tabId, EventKeys.content_StartedObserving);
  }

  // Receives the clicked input element and relevant data and calls the parser
  if (action === EventKeys.background_FoundInputElement) {
    parseClickedInput(tabId, payload);
  }
});
