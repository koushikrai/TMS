export const DEV_USE_MOCK = true; // Set to false to integrate real APIs

export const delay = (ms?: number) => {
  const waitTime = ms !== undefined ? ms : Math.floor(Math.random() * 500) + 300; // 300ms - 800ms
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};
