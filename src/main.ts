import * as _ from "@fxts/core";
import { getBodyContent, getHeadContent, getTailContent } from "./helper";
import { getActiveData, getHeightData } from "./storageHelper";
import { parseMarkdownImageLinks, throttle } from "./util";

let imageHeight = 300;
let isActive = true;

// chrome.runtime.onMessage.addListener(
//   (msg: { height: number; isActive: boolean }, __, sendResponse) => {
//     console.debug(msg);
//     imageHeight = msg.height ?? imageHeight;
//     isActive = msg.isActive ?? isActive;

//     sendResponse("success");
//   }
// );

init();

async function init() {
  // const [height, active] = await Promise.all([getHeightData(), getActiveData()]);

  // imageHeight = height ?? imageHeight;
  // isActive = active ?? isActive;

  document.addEventListener("click", () => {
    const activeEl = document.activeElement;
    if (activeEl?.tagName === "TEXTAREA" && isActive) {
      const textarea = activeEl as HTMLTextAreaElement;

      function focusOutHandler() {
        textarea.removeEventListener("select", onSelectHandler);
        textarea.removeEventListener("focusout", focusOutHandler);
      }

      textarea.addEventListener("select", onSelectHandler);
      textarea.addEventListener("focusout", focusOutHandler);
    }
  });

  const onSelectHandler = throttle((event: Event) => {
    const el = event.target as HTMLTextAreaElement;
    const value = el.value;

    const selectedText = value.slice(el.selectionStart, el.selectionEnd);
    const imageTagLinks = parseMarkdownImageLinks(selectedText);

    if (!imageTagLinks.length) {
      return;
    }

    const startImageLink = _.head(imageTagLinks);
    const endImageLink = _.last(imageTagLinks);

    if (!startImageLink || !endImageLink) {
      return;
    }

    const startImageLinkIndex = selectedText.indexOf(startImageLink);
    const endImageLinkIndex = selectedText.indexOf(endImageLink) + endImageLink.length - 1;

    const head = getHeadContent(selectedText, startImageLinkIndex);
    const body = getBodyContent(selectedText, startImageLinkIndex, endImageLinkIndex, imageHeight);
    const tail = getTailContent(selectedText, endImageLinkIndex);

    document.execCommand("insertText", false, head + body + tail);
  });
}
