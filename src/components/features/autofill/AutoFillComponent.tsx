import { EventKeys } from "@/events-keys";
import Message from "@/utils/message";
import { Logger } from "@/utils/logger";
import { useState } from "react";

export default function PopupComponent() {
  const [isObserving, setIsObserving] = useState(false);
  const [status, setStatus] = useState(
    'Click "Auto fill" to start selecting an input field.'
  );

  const logger = new Logger("popup");

  const startObserving = async () => {
    logger.log("Starting observation...");
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      logger.log("Tab:", tab);
      if (!tab) {
        setStatus("Could not find active tab to observe.");
        return;
      }
      logger.log("Tab ID:", tab.id);
      if (!tab.id) {
        throw new Error("No tab ID found");
      }
      Message.sendRuntimeMessage(tab.id, EventKeys.background_StartedAutoFill);
      setIsObserving(true);
      setStatus("Observing... Click an input field on the page.");
    } catch (e) {
      logger.error("Error starting observation:", e);
      setStatus(
        "Error: Could not connect to the page. Please refresh the page and try again."
      );
      setIsObserving(false);
    }
  };

  return (
    <>
      <div className="card p-4 space-y-4 flex flex-col">
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={startObserving}
          disabled={isObserving}
        >
          {isObserving ? "Observing..." : "Auto fill"}
        </button>
        <p>{status}</p>
      </div>
    </>
  );
}
