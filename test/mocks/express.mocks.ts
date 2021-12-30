import type { Request, Response } from 'express';
import sinon, { SinonSandbox, SinonSpy } from 'sinon';

type ExpressSpiedMethod = 'send' | 'status' | 'setHeader' | 'end' | 'next';

export interface MockedResponse {
  status?: number;
  header?: string[];
  body?: unknown;
}

export interface NextError {
  error?: unknown;
}

export class ExpressMocks {
  #sandbox: SinonSandbox;
  #spies: Record<ExpressSpiedMethod | string, SinonSpy> = {};

  constructor() {
    this.#sandbox = sinon.createSandbox();
  }

  restore(): void {
    this.#sandbox.restore();
  }

  spy(what: ExpressSpiedMethod): SinonSpy {
    return this.#spies[what];
  }

  mockResponse(response: MockedResponse = {}, locals: any = { data: {} }): Response {
    const mockRes = {
      send(body) {
        response.body = body;
      },
      status(code: number) {
        response.status = code;
      },
      end() {
        return;
      },
      setHeader(name: string, value: number | string | ReadonlyArray<string>) {
        response.header = [name, String(value)];
      },
      locals,
    } as Response;

    this.#spies.send = this.#sandbox.spy(mockRes, 'send');
    this.#spies.status = this.#sandbox.spy(mockRes, 'status');
    this.#spies.end = this.#sandbox.spy(mockRes, 'end');
    this.#spies.setHeader = this.#sandbox.spy(mockRes, 'setHeader');

    return mockRes;
  }

  mockRequest(): Request {
    return {} as Request;
  }

  mockNextFunction(error: NextError = {}): () => void {
    const mockNext = sinon.stub().callsFake((err) => {
      if (error) {
        error.error = err;
      }
    });

    this.#spies.next = mockNext;

    return mockNext;
  }
}
