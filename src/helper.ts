import * as _ from "@fxts/core";
import { parseImageUrl, parseMarkdownImageLinks } from "./util";

export const makeImageTag = (link: string) => {
  return `<img src="${link}" width=300 alt="notfoundimage"/>`;
};

export const convertMarkdownImageLinkToImageTag = (text: string) => {
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

  if (selectionEnd === endImageLinkIndex) {
    return value.slice(selectionEnd, value.length);
  }

  return value.slice(selectionStart + endImageLinkIndex + 1, value.length);
};
