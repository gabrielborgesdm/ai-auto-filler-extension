export function fillInput(targetId: string, value: string) {
  const target = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[data-filler-id="${targetId}"]`
  );

  console.log("[CRXJS] Target:", target);
  if (!target) return;

  console.log("[CRXJS] Filling input:", target);
  target.value = value;
  target.dispatchEvent(new Event("input", { bubbles: true }));
  target.dispatchEvent(new Event("change", { bubbles: true }));
}

export const startObservingInputClick = async () => {
  console.log("[CRXJS] Starting observation...");

  return await new Promise((resolve) => {
    const clickHandler = (event: MouseEvent) => {
      console.log("[CRXJS] Click listener triggered");
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        event.preventDefault();
        event.stopPropagation();
        console.log("[CRXJS] Captured element:", target);
        const inputElement = target as HTMLInputElement | HTMLTextAreaElement;
        if (!inputElement) return;
        const uuid = crypto.randomUUID();
        // set the uuid as a data attribute to later use it to fill the input
        inputElement.setAttribute("data-filler-id", uuid);

        // Capture the element and its parent, I'll use this on a llm to figure out what is the purpose of the input
        const serializedInputHtml = inputElement.outerHTML;
        const serializedParentHtml = inputElement.parentElement?.outerHTML;
        resolve({
          inputUuid: uuid,
          element: serializedInputHtml,
          parent: serializedParentHtml,
        });
      }
    };

    document.addEventListener("click", clickHandler, {
      capture: true,
      once: true,
    });
  });
};
