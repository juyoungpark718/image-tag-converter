const input = document.querySelector("#img-width") as HTMLInputElement;
const button = document.querySelector("#send-btn") as HTMLButtonElement;

const getCurrentTab = async () => {
  let queryOptions = { active: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

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
      input.value = "";
    });
  });
});
