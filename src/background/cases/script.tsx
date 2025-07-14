export const injectScriptAsync = async <T,>(
  tabId: number,
  func: (...args: any[]) => unknown,
  ...args: any[]
): Promise<T> => {
  console.log("[CRXJS] Injecting script...");
  return await chrome.scripting
    .executeScript({
      target: { tabId },
      func: func,
      args,
    })
    .then((results) => {
      return results[0]?.result as T;
    });
};
