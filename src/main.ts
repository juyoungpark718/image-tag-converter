import * as _ from "@fxts/core";
import { getBodyContent, getHeadContent, getTailContent } from "./helper";
import { parseMarkdownImageLinks, throttle } from "./util";

let imageHeight = 300;

// chrome.runtime.onMessage.addListener((msg: { height: number }) => {
//   imageHeight = msg.height || 300;
// });

document.addEventListener("click", () => {
  const activeEl = document.activeElement;
  if (activeEl?.tagName === "TEXTAREA") {
    const textarea = activeEl as HTMLTextAreaElement;
    textarea.addEventListener("select", onSelectHandler);
    textarea.addEventListener("focusout", () => {
      textarea.removeEventListener("select", onSelectHandler);
    });
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

  const head = getHeadContent(value, el.selectionStart, startImageLinkIndex);
  const body = getBodyContent(selectedText, startImageLinkIndex, endImageLinkIndex, imageHeight);
  const tail = getTailContent(value, el.selectionStart, el.selectionEnd, endImageLinkIndex);

  document.execCommand("insertText", false, head + body + tail);

  el.value = head + body + tail;
});
