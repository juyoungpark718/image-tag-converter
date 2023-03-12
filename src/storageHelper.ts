export function getHeightData() {
  return new Promise<number>((resolve) => {
    chrome.storage.sync.get("height", (res) => {
      const height = res["height"] ?? 300;
      resolve(height);
    });
  });
}

export function getActiveData() {
  return new Promise<boolean>((resolve) => {
    chrome.storage.sync.get("active", (res) => {
      const active = res["active"] ?? true;
      resolve(active);
    });
  });
}

export function sendSavedData(height: number, active: boolean) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs.length) {
        return;
      }

      const [tab] = tabs;

      if (!tab.id) {
        return;
      }

      chrome.tabs.sendMessage(tab.id, { height, isActive: active }, () => {
        resolve(true);
      });
    });
  });
}
