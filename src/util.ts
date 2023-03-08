import * as _ from "@fxts/core";

export const throttle = <T>(fn: (event: T) => void, time = 200) => {
  let setTimeoutId: number | null = null;

  return (event: T) => {
    if (setTimeoutId) {
      return;
    }

    setTimeoutId = window.setTimeout(() => {
      fn(event);
      setTimeoutId = null;
    }, time);

    return;
  };
};

export const parseMarkdownImageLinks = (text: string) => {
  const markdownImageLinkRegex =
    /!\[[^\]]+\]\(([^ \)]+)(?: \"([^\"]+)\")?\.(png|jpe?g|gif|bmp)\)/gim;
  const matchedMarkdownImageLinks = text.trim().match(markdownImageLinkRegex);

  if (!matchedMarkdownImageLinks) return [];

  return matchedMarkdownImageLinks;
};

export const parseImageUrl = (text: string) => {
  const imageUrlRegex = /\(.+\.(png|jpe?g|gif|bmp)\)/gim;
  const matchedImageUrls = text.trim().match(imageUrlRegex);

  if (!matchedImageUrls) return "";

  const url = _.head(matchedImageUrls);

  return url?.slice(1, -1) || "";
};
