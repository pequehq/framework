import type { Application, Request, Response } from 'express';
import sinon, { SinonSandbox, SinonSpy } from 'sinon';

type ExpressSpiedMethod =
  | 'res.send'
  | 'res.status'
  | 'res.setHeader'
  | 'res.end'
  | 'next'
  | 'app.use'
  | 'app.get'
  | 'app.post'
  | 'app.put'
  | 'app.patch'
  | 'app.delete'
  | 'app.options';

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

  mockApplication(): Application {
    this.#spies['app.use'] = this.#sandbox.fake();
    this.#spies['app.get'] = this.#sandbox.fake();
    this.#spies['app.post'] = this.#sandbox.fake();
    this.#spies['app.put'] = this.#sandbox.fake();
    this.#spies['app.patch'] = this.#sandbox.fake();
    this.#spies['app.delete'] = this.#sandbox.fake();
    this.#spies['app.options'] = this.#sandbox.fake();

    return {
      use: this.#spies['app.use'],
      get: this.#spies['app.get'],
      post: this.#spies['app.post'],
      put: this.#spies['app.put'],
      patch: this.#spies['app.patch'],
      delete: this.#spies['app.delete'],
      options: this.#spies['app.options'],
    } as unknown as Application;
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

    this.#spies['res.send'] = this.#sandbox.spy(mockRes, 'send');
    this.#spies['res.status'] = this.#sandbox.spy(mockRes, 'status');
    this.#spies['res.end'] = this.#sandbox.spy(mockRes, 'end');
    this.#spies['res.setHeader'] = this.#sandbox.spy(mockRes, 'setHeader');

    return mockRes;
  }

  mockRequest(): Request {
    return {} as Request;
  }

  mockNextFunction(error: NextError = {}): () => void {
    const mockNext = this.#sandbox.stub().callsFake((err) => {
      if (error) {
        error.error = err;
      }
    });

    this.#spies.next = mockNext;

    return mockNext;
  }
}
