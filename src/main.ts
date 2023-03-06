import * as _ from "@fxts/core";

const parseMarkdownImageLinks = (text: string) => {
  const markdownImageLinkRegex = /!\[[^\]]+\]\(([^ \)]+)(?: \"([^\"]+)\")?\)/gim;
  const matchedMarkdownImageLinks = text.trim().match(markdownImageLinkRegex);

  if (!matchedMarkdownImageLinks) return [];

  return matchedMarkdownImageLinks.map(convertMarkdownImageLinkToImageTag);
};

const convertMarkdownImageLinkToImageTag = (link: string) => {
  return `<img src="${parseImageUrl(link)}" width=300 alt="notfoundimage"/>`;
};

const parseImageUrl = (text: string) => {
  const imageUrlRegex = /\(.+\.(png|jpe?g|gif|bmp)\)/gim;
  const matchedImageUrls = text.trim().match(imageUrlRegex);

  if (!matchedImageUrls) return "";

  const url = _.head(matchedImageUrls);

  return url?.slice(1, -1) || "";
};
