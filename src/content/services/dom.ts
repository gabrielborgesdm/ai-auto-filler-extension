import { Logger } from "@/utils/logger";
import Message from "@/utils/message";

const logger = new Logger("content-dom");

export const fillInput = (targetId: string, value: string) => {
  logger.log("Filling input:", targetId, value);
  const target = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[data-filler-id="${targetId}"]`
  );

  if (!target) {
    logger.error("Target not found");
    return;
  }

  target.value = value;
  target.dispatchEvent(new Event("input", { bubbles: true }));
  target.dispatchEvent(new Event("change", { bubbles: true }));
};

export const getInputElement = (targetId: string) => {
  return document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[data-filler-id="${targetId}"]`
  );
};

export const observeAndReturnInputClick = async (): Promise<{
  input?: HTMLInputElement | HTMLTextAreaElement;
  error?: string;
} | void> => {
  logger.log("Initializing promise observation");
  // Promisify the click handler to return the input element or null
  return await new Promise((resolve) => {
    const clickHandler = (event: MouseEvent) => {
      logger.log("Click handler called");
      const target = event.target as HTMLElement;

      if (!target) return resolve({ error: "Something went wrong" });

      if (
        !target.isContentEditable &&
        !["INPUT", "TEXTAREA"].some((tag) => tag === target.tagName)
      )
        return resolve({ error: "Select a valid text input" });

      event.preventDefault();
      event.stopPropagation();

      const inputElement = target as HTMLInputElement | HTMLTextAreaElement;
      resolve({ input: inputElement });
    };

    document.addEventListener("click", clickHandler, {
      capture: true,
      once: true,
    });
  });
};

// Set a data uuid to the input so we can identify it later
export const setInputUuid = (
  inputElement: HTMLInputElement | HTMLTextAreaElement
) => {
  const uuid = crypto.randomUUID();
  inputElement.setAttribute("data-filler-id", uuid);

  return uuid;
};
