export async function wait(interval: 'short' | 'medium' | 'long' | number = 'short'): Promise<void> {
  let ms: number;
  let timeout: NodeJS.Timeout;

  if (typeof interval === 'number') {
    ms = interval;
  } else {
    ms = {
      short: 100,
      medium: 1000,
      long: 3000,
    }[interval];
  }

  await new Promise((resolve) => {
    timeout = setTimeout(resolve, ms);
  });

  // @ts-ignore
  clearTimeout(timeout);
}
