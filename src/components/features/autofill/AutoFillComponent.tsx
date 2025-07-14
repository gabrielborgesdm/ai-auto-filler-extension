import { useState } from "react";

export default function PopupComponent() {
  const [isObserving, setIsObserving] = useState(false);
  const [status, setStatus] = useState(
    'Click "Auto fill" to start selecting an input field.'
  );

  const startObserving = async () => {
    console.log("[CRXJS] Starting observation...");
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log("[CRXJS] Tab:", tab);
      if (!tab) {
        setStatus("Could not find active tab to observe.");
        return;
      }

      chrome.runtime.sendMessage({ action: "startObserving", tabId: tab.id });
      setIsObserving(true);
      setStatus("Observing... Click an input field on the page.");
    } catch (e) {
      console.error("Error starting observation:", e);
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
