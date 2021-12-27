import {
  ClassDeclaration,
  ControllerDefinition,
  ExpressMethods,
  InterceptorType,
  MiddlewareHandler,
  ModuleClass,
  ModuleDefinition,
  ParamDefinition,
  ParamType,
  ProviderType,
  RouteDefinition,
} from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { Controllers } from '../../models/dependency-injection/controller.service';
import { Injector } from '../../models/dependency-injection/injector.service';
import { Modules } from '../../models/dependency-injection/module.service';
import { Providers } from '../../models/dependency-injection/providers';
import { CustomProvider } from '../injectable';

interface ProviderOptions {
  type: ProviderType;
}

interface InjectableInterface extends ProviderOptions {
  customProvider?: CustomProvider;
}

interface InterceptorInterface extends ProviderOptions {
  interceptorType: InterceptorType;
  clazz: ClassDeclaration;
}

const metadataKeys: Record<ParamType, string> = {
  body: DECORATORS.metadata.BODY,
  header: DECORATORS.metadata.HEADERS,
  param: DECORATORS.metadata.PARAMETERS,
  request: DECORATORS.metadata.REQUEST,
  response: DECORATORS.metadata.RESPONSE,
  query: DECORATORS.metadata.QUERY,
  cookies: DECORATORS.metadata.COOKIES,
  session: DECORATORS.metadata.SESSION,
};

const extractParameters = (param: ParamType, target: object, propertyKey: string | symbol): ParamDefinition[] => {
  const metadataKey = metadataKeys[param];

  if (!metadataKey) {
    throw new Error(`No metadata key for [${param}].`);
  }

  return (Reflect.getMetadata(metadataKey, target.constructor) ?? [])
    .map((param) => param[propertyKey])
    .filter(Boolean);
};

export const controllerBuilder = (prefix: string, middlewares: MiddlewareHandler): ClassDecorator => {
  return (target): void => {
    const controllerDefinition: ControllerDefinition = {
      prefix,
      middlewares: Array.isArray(middlewares) ? middlewares : [middlewares],
      guards: [],
      interceptors: [],
    };

    Reflect.defineMetadata(DECORATORS.metadata.CONTROLLER, controllerDefinition, target);

    if (!Reflect.hasMetadata(DECORATORS.metadata.ROUTES, target)) {
      Reflect.defineMetadata(DECORATORS.metadata.ROUTES, [], target);
    }
  };
};

// @TODO refactor to take an object instead of N parameters
export const methodBuilder = (
  method: ExpressMethods,
  path: string,
  middleware: MiddlewareHandler,
  documentOnly: boolean,
  noRestWrapper: boolean,
): MethodDecorator => {
  return (target, propertyKey): void => {
    if (!Reflect.hasMetadata(DECORATORS.metadata.ROUTES, target.constructor)) {
      Reflect.defineMetadata(DECORATORS.metadata.ROUTES, [], target.constructor);
    }

    // Get the routes.
    const routes = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor) as RouteDefinition[];

    routes.push({
      requestMethod: method,
      path,
      method: {
        name: propertyKey,
        body: extractParameters('body', target, propertyKey),
        params: extractParameters('param', target, propertyKey),
        query: extractParameters('query', target, propertyKey),
        headers: extractParameters('header', target, propertyKey),
        request: extractParameters('request', target, propertyKey),
        response: extractParameters('response', target, propertyKey),
        cookies: extractParameters('cookies', target, propertyKey),
        session: extractParameters('session', target, propertyKey),
      },
      middlewareFunctions: Array.isArray(middleware) ? middleware : [middleware],
      documentOnly,
      noRestWrapper,
    });

    Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
  };
};

export const paramBuilder = (param: ParamType, paramName?: string): ParameterDecorator => {
  const metadataKey = metadataKeys[param];

  if (!metadataKey) {
    throw new Error(`No metadata key for [${param}].`);
  }

  return (target, propertyKey, parameterIndex): void => {
    const parameters = Reflect.getMetadata(metadataKey, target.constructor) ?? [];

    parameters.push({
      [propertyKey]: {
        index: parameterIndex,
        param: paramName,
      },
    });

    Reflect.defineMetadata(metadataKey, parameters, target.constructor);
  };
};

export const moduleBuilder = (module: ModuleDefinition): ClassDecorator => {
  return (target): void => {
    Modules.push(target as unknown as ModuleClass);

    if (module.controllers) {
      module.controllers.forEach((controller) => Controllers.push(controller));
    }

    // Setting custom providers.
    (module.providers ?? []).forEach((provider) => {
      if (provider.useClass) {
        Providers.addProvider('injectable', {
          name: typeof provider.provider === 'string' ? provider.provider : provider.provider.name,
          clazz: provider.useClass as any, // @TODO check which type should use
        });
      }
    });
  };
};

export const interceptorBuilder = (): ClassDecorator => {
  return (target): void => {
    Providers.addProvider('interceptor', { name: target.name, clazz: target as any });
  };
};

export const injectableBuilder = (options: InjectableInterface): ClassDecorator => {
  return (target): void => {
    let name = target.name;

    if (options.customProvider) {
      if (typeof options.customProvider.interface === 'string') {
        name = options.customProvider.interface;
      } else {
        name = options.customProvider.interface.name;
      }
    }

    Providers.addProvider('injectable', { name, clazz: target as any }); // @TODO check clazz type
  };
};

export const injectClass = (provider: string): PropertyDecorator => {
  return (target, key): void => {
    Object.defineProperty(target, key, {
      get: () => Injector.resolve('injectable', provider),
      enumerable: true,
      configurable: true,
    });
  };
};
