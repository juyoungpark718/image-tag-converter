import * as _ from "@fxts/core";
import { throttle } from "./util";

document.addEventListener("click", () => {
  const activeEl = document.activeElement;

  if (activeEl?.tagName === "TEXTAREA") {
    const textarea = activeEl as HTMLTextAreaElement;

    textarea.addEventListener(
      "select",
      throttle((event) => {
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
        const body = getBodyContent(selectedText, startImageLinkIndex, endImageLinkIndex);
        const tail = getTailContent(value, el.selectionStart, el.selectionEnd, endImageLinkIndex);

        el.value = head + body + tail;
      })
    );
  }
});

const parseMarkdownImageLinks = (text: string) => {
  const markdownImageLinkRegex =
    /!\[[^\]]+\]\(([^ \)]+)(?: \"([^\"]+)\")?\.(png|jpe?g|gif|bmp)\)/gim;
  const matchedMarkdownImageLinks = text.trim().match(markdownImageLinkRegex);

  if (!matchedMarkdownImageLinks) return [];

  return matchedMarkdownImageLinks;
};

const makeImageTag = (link: string) => {
  return `<img src="${link}" width=300 alt="notfoundimage"/>`;
};

const parseImageUrl = (text: string) => {
  const imageUrlRegex = /\(.+\.(png|jpe?g|gif|bmp)\)/gim;
  const matchedImageUrls = text.trim().match(imageUrlRegex);

  if (!matchedImageUrls) return "";

  const url = _.head(matchedImageUrls);

  return url?.slice(1, -1) || "";
};

const convertMarkdownImageLinkToImageTag = (text: string) => {
  return _.pipe(
    text,
    parseMarkdownImageLinks,
    _.map(parseImageUrl),
    _.map(makeImageTag),
    _.toArray,
    _.join("\n")
  );
};

export const getHeadContent = (
  value: string,
  selectionStart: number,
  startImageLinkIndex: number
) => {
  const isSelectionStartZero = 0 === selectionStart;

  if (isSelectionStartZero) {
    return value.slice(0, startImageLinkIndex);
  }

  return value.slice(0, selectionStart + startImageLinkIndex);
};

export const getBodyContent = (
  selectedText: string,
  startImageLinkIndex: number,
  endImageLinkIndex: number
) => {
  return convertMarkdownImageLinkToImageTag(
    selectedText.slice(startImageLinkIndex, endImageLinkIndex)
  );
};

export const getTailContent = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
  endImageLinkIndex: number
) => {
  const isSelectionStartZero = 0 === selectionStart;

  if (isSelectionStartZero) {
    return value.slice(endImageLinkIndex + 1, value.length);
  }

  console.debug(selectionEnd, endImageLinkIndex);
  if (selectionEnd === endImageLinkIndex) {
    return value.slice(selectionEnd, value.length);
  }

  return value.slice(selectionStart + endImageLinkIndex + 1, value.length);
};
