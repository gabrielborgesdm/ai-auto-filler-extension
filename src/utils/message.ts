import { EventKeys } from "@/events-keys";
import { Logger } from "@/utils/logger";

const logger = new Logger("utils-message");
class Message {
  static buildMessage(tabId: number, action: EventKeys, payload?: any) {
    return {
      tabId,
      action,
      payload,
    };
  }

  static isTabIdValid(tabId?: number) {
    if (!tabId && tabId !== 0) {
      logger.error("No tab ID found");
      return false;
    }

    return true;
  }

  static sendTabMessage(tabId: number, action: EventKeys, payload?: any) {
    if (!this.isTabIdValid(tabId)) return;

    logger.log("Sending tab message:", action);
    chrome.tabs.sendMessage(tabId, this.buildMessage(tabId, action, payload));
  }

  static sendRuntimeMessage(tabId: number, action: EventKeys, payload?: any) {
    if (!this.isTabIdValid(tabId)) return;

    logger.log("Sending runtime message:", action);
    chrome.runtime.sendMessage({
      action,
      tabId,
      payload,
    });
  }

  static listen(callback: (request: any) => void) {
    chrome.runtime.onMessage.addListener((request) => {
      logger.log("Received message:", request.action);

      const tabId = request.tabId || request.payload?.tabId;
      if (!this.isTabIdValid(tabId)) return;

      callback({
        tabId,
        action: request.action,
        payload: request.payload,
      });
    });
  }
}

export default Message;
