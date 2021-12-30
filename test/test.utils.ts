import express from 'express';
import sinon from 'sinon';
import { SinonSpy } from 'sinon';

type SinonSpies = 'send' | 'status' | 'setHeader' | 'end' | 'next';

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
  private mockRes: Partial<express.Response>;
  private mockReq: Partial<express.Request>;
  private mockNext: any;
  private spies: Record<SinonSpies | string, SinonSpy> = {};

  spy(what: SinonSpies): SinonSpy {
    return this.spies[what];
  }

  mockResponse(response: { status?: number; header?: string[]; body?: unknown }): Partial<express.Response> {
    this.mockRes = {
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
      locals: {},
    };

    this.spies.send = sinon.spy(this.mockRes, 'send');
    this.spies.status = sinon.spy(this.mockRes, 'status');
    this.spies.end = sinon.spy(this.mockRes, 'end');
    this.spies.setHeader = sinon.spy(this.mockRes, 'setHeader');

    return this.mockRes;
  }

  mockRequest(): Partial<express.Request> {
    return {};
  }

  mockNextFunction(error?: { error?: unknown }): any {
    this.mockNext = {
      next(err?: unknown): void {
        if (error) {
          error.error = err;
        }
      },
    };

    this.spies.next = sinon.spy(this.mockNext, 'next');

    return this.mockNext;
  }
}
