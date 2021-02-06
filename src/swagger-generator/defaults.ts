import { SwaggerResponseType } from '../models/interfaces/swagger/swagger-response-type.interface';

export interface HttpErrors {
  description?: string;
  object?: any;
}

const prepareHttpErrors = (
  httpError: HttpErrors,
  description: string,
  object: any
) => {
  if (!httpError) {
    httpError = {};
  }
  httpError.description = !httpError.description
    ? description
    : httpError.description;
  httpError.object = !httpError.object ? object : httpError.object;
  return httpError;
};

export namespace SwaggerDefaults {
  export const PARAMETERS_MIN = ['platform', 'portability'];
  export const PARAMETERS_MIN_EXTENDED = [
    'platform',
    'portability',
    'overridePortability',
    'country',
    'avoidCache'
  ];
  export const PARAMETERS_FULL = [
    ...PARAMETERS_MIN,
    'overridePortability',
    'country',
    'registerCountry',
    'authenticateState',
    'avoidCache',
    'uuid',
    'version'
  ];
  export const PARAMETERS_DID = 'did';
  export const PARAMETERS_DEVICE_ID = 'deviceId';
  export const CONTENT = 'application/json; charset=utf-8';
  export const CONTENT_X_WWW_FORM_URLENCODED =
    'application/x-www-form-urlencoded';

  export const HTTP_ERROR = (
    statusCode: number,
    description: string,
    object: any = BaseErrorDto
  ): SwaggerResponseType => {
    return {
      statusCode,
      object,
      content: SwaggerDefaults.CONTENT,
      description
    };
  };

  export const ERROR_400 = (httpError?: HttpErrors): SwaggerResponseType => {
    const error = prepareHttpErrors(httpError, 'Bad request', BaseErrorDto);
    return HTTP_ERROR(400, error.description, error.object);
  };

  export const ERROR_401 = (httpError?: HttpErrors): SwaggerResponseType => {
    const error = prepareHttpErrors(httpError, 'Invalid token', BaseErrorDto);
    return HTTP_ERROR(401, error.description, error.object);
  };

  export const ERROR_403 = (httpError?: HttpErrors): SwaggerResponseType => {
    const error = prepareHttpErrors(httpError, 'Unknown user', BaseErrorDto);
    return HTTP_ERROR(403, error.description, error.object);
  };

  export const ERROR_404 = (httpError?: HttpErrors): SwaggerResponseType => {
    const error = prepareHttpErrors(httpError, 'Not found', BaseErrorDto);
    return HTTP_ERROR(404, error.description, error.object);
  };

  export const ERROR_500 = (httpError?: HttpErrors): SwaggerResponseType => {
    const error = prepareHttpErrors(httpError, 'Server error', BaseErrorDto);
    return HTTP_ERROR(500, error.description, error.object);
  };
}
