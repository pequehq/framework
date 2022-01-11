import { HttpService } from '../src';

async function wait(interval: 'short' | 'medium' | 'long' | number = 'short'): Promise<void> {
  let ms: number;

  if (typeof interval === 'number') {
    ms = interval;
  } else {
    ms = {
      short: 100,
      medium: 1000,
      long: 3000,
    }[interval];
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
}

const httpClient = new HttpService();

async function httpRequest<TRes = any, TData = any>(methodAndPath: string, data?: TData): Promise<TRes> {
  const [method, path] = methodAndPath.trim().split(' ');

  return (
    await httpClient.request<TRes>({
      url: 'http://localhost:8888' + path,
      method: method as any,
      data,
    })
  ).data;
}

const http = {
  client: httpClient,
  req: httpRequest,
};

export { wait, http };
