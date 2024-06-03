export const copyTextToClipboard = (text) => {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(text);
  }
};
