import * as _ from "@fxts/core";
import { parseImageUrl, parseMarkdownImageLinks } from "./util";

export const makeImageTag = (imageHeight: number) => (link: string) => {
  return `<img src="${link}" width=${imageHeight} alt="notfoundimage"/>`;
};

export const convertMarkdownImageLinkToImageTag = (text: string, imageHeight: number) => {
  return _.pipe(
    text,
    parseMarkdownImageLinks,
    _.map(parseImageUrl),
    _.map(makeImageTag(imageHeight)),
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
  endImageLinkIndex: number,
  imageHeight: number
) => {
  return convertMarkdownImageLinkToImageTag(
    selectedText.slice(startImageLinkIndex, endImageLinkIndex + 1),
    imageHeight
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
