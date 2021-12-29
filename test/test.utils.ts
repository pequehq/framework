import express from 'express';

export async function wait(interval: 'short' | 'medium' | 'long' | number = 'short'): Promise<void> {
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

export class ExpressMocks {
  mockResponse(response: { status?: number; header?: string[]; body?: unknown }): Partial<express.Response> {
    return {
      send: (body) => (response.body = body),
      status(code: number): any {
        response.status = code;
      },
      end(cb?: () => void) {
        return;
      },
      setHeader(name: string, value: number | string | ReadonlyArray<string>): any {
        response.header = [name, String(value)];
      },
    };
  }

  mockRequest(): Partial<express.Request> {
    return {};
  }

  mockNextFunction(): express.NextFunction {
    return (): unknown => undefined;
  }
}
