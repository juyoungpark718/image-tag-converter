export const throttle = <T>(fn: (event: T) => void, time = 200) => {
  let setTimeoutId: number | null = null;

  return (event: T) => {
    if (setTimeoutId) {
      return;
    }

    setTimeoutId = window.setTimeout(() => {
      fn(event);
    }, time);

    return;
  };
};
