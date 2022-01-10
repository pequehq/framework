import { Config } from '../../services/config/config.service';
import { CONFIG_STORAGES } from '../constants/config';
import { HTTP_STATES } from '../constants/http-states';
import { WebServerOptions } from '../interfaces/web-server-options.interface';

// @TODO manage to add as much HTTP exceptions as possible.

interface HttpPartialError<TError> {
  message?: string;
  error?: TError;
  stack?: string;
}

export interface HttpError<TError> extends HttpPartialError<TError> {
  statusCode: number;
}

export class HttpException<TError> extends Error {
  constructor(public httpException: HttpError<TError>) {
    super();
    this.#config();
  }

  #config(): void {
    if (this.httpException.message) {
      this.message = this.httpException.message;
    }

    this.name = this.constructor.name;
    if (Config.get<WebServerOptions>(CONFIG_STORAGES.EXPRESS_SERVER).showOriginalErrorObject) {
      this.httpException.stack = this.stack;
    }
  }
}

export class BadRequestException<TError> extends HttpException<TError> {
  constructor(error: HttpPartialError<TError>) {
    super({ statusCode: HTTP_STATES.HTTP_400, error: error.error, message: error.message });
  }
}

export class ForbiddenError<TError> extends HttpException<TError> {
  constructor(error: HttpPartialError<TError>) {
    super({ statusCode: HTTP_STATES.HTTP_403, error: error.error, message: error.message });
  }
}

export class NotFoundException<TError> extends HttpException<TError> {
  constructor(error: HttpPartialError<TError>) {
    super({ statusCode: HTTP_STATES.HTTP_404, error: error.error, message: error.message });
  }
}

export class InternalServerErrorException<TError> extends HttpException<TError> {
  constructor(error: HttpPartialError<TError>) {
    super({ statusCode: HTTP_STATES.HTTP_500, error: error.error, message: error.message });
  }
}
