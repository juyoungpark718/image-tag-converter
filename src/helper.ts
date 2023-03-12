import * as _ from "@fxts/core";

export const makeImageTag = (imageHeight: number) => (link: string) => {
  return `<img src="${link}" width=${imageHeight} alt="notfoundimage"/>`;
};

export const replaceMarkdownImageLinks = (text: string, imageHeight: number) => {
  const markdownImageLinkRegex = /!\[[^\]]+\]\(([^\)]+)(?:\"([^\"]+)\")?\.(png|jpe?g|gif|bmp)\)/gim;

  return text.trim().replace(markdownImageLinkRegex, imageTagReplacer(imageHeight));
};

export const imageTagReplacer =
  (imageHeight: number) => (__: string, p1: string, ___: string, p3: string, ____: string) => {
    return _.pipe(`${p1}.${p3}`, makeImageTag(imageHeight));
  };

export const getHeadContent = (selectedText: string, startImageLinkIndex: number) => {
  return selectedText.slice(0, startImageLinkIndex);
};

export const getBodyContent = (
  selectedText: string,
  startImageLinkIndex: number,
  endImageLinkIndex: number,
  imageHeight: number
) => {
  return replaceMarkdownImageLinks(
    selectedText.slice(startImageLinkIndex, endImageLinkIndex + 1),
    imageHeight
  );
};

export const getTailContent = (selectedText: string, endImageLinkIndex: number) => {
  return selectedText.slice(endImageLinkIndex + 1, selectedText.length);
};
