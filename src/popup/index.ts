import { getActiveData, getHeightData } from "../storageHelper";

const input = document.querySelector("#img-width") as HTMLInputElement;
const button = document.querySelector("#send-btn") as HTMLButtonElement;
const checkbox = document.querySelector("#converter-active") as HTMLInputElement;

init();

async function init() {
  const [height, active] = await Promise.all([getHeightData(), getActiveData()]);

  input.value = height.toString();
  checkbox.checked = active;

  initEventHandler();

  return;
}

function initEventHandler() {
  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs.length) {
        return;
      }

      const [tab] = tabs;

      if (!tab.id) {
        return;
      }

      const value = input.value;

      if (Number(value) <= 0) {
        return;
      }

      chrome.tabs.sendMessage(tab.id, { height: value }, () => {
        chrome.storage.sync.set({ height: value });
        console.debug(value);
      });
    });
  });

  checkbox.addEventListener("change", (event) => {
    const { checked } = event.target as HTMLInputElement;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs.length) {
        return;
      }

      const [tab] = tabs;

      if (!tab.id) {
        return;
      }

      chrome.tabs.sendMessage(tab.id, { isActive: checked }, () => {
        chrome.storage.sync.set({ active: checked });
        console.debug(checked);
      });
    });
  });
}
