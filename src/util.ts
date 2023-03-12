import { MARKDOWN_IMAGE_LINK_REGEX } from "./constant";

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
  const matchedMarkdownImageLinks = text.trim().match(MARKDOWN_IMAGE_LINK_REGEX);

  if (!matchedMarkdownImageLinks) return [];

  return matchedMarkdownImageLinks;
};
