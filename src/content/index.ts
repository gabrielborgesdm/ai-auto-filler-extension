import {
  fillInput,
  observeAndReturnInputClick,
  setInputUuid,
} from "@/content/services/dom";
import { EventKeys } from "@/events-keys";
import { InputData } from "@/types/Input";
import Message from "@/utils/message";
import { Logger } from "@/utils/logger";

const logger = new Logger("content");

async function startObservingInputClick(tabId: number) {
  const result = await observeAndReturnInputClick();

  if (!result || result.error) {
    logger.error("Something went wrong", result?.error ?? "Unknown error");
    return;
  }

  const { input } = result;
  // TO-DO: handle null input
  if (!input) return;

  // Set a data uuid to the input so we can identify it later
  const uuid = setInputUuid(input);

  const serializedInputHtml = input.outerHTML;
  const serializedParentHtml = input.parentElement?.outerHTML;

  // Send message to background script to process the input
  Message.sendRuntimeMessage(tabId, EventKeys.background_FoundInputElement, {
    inputUuid: uuid,
    element: serializedInputHtml,
    parent: serializedParentHtml,
  } as InputData);
}

Message.listen(({ tabId, action, payload }) => {
  if (action === EventKeys.content_StartedObserving) {
    startObservingInputClick(tabId);
  }

  // Receives the autofill response and fills the input
  if (action === EventKeys.content_ProcessedElement) {
    fillInput(payload.inputUuid, payload.value);
  }
});
