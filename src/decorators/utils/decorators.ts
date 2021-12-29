import {
  ClassDeclaration,
  ControllerDefinition,
  ExpressMethods,
  InterceptorClass,
  InterceptorType,
  MiddlewareHandler,
  ModuleClass,
  ModuleDefinition,
  ParamDefinition,
  ParamType,
  ProviderClass,
  ProviderType,
  RouteDefinition,
  TransformerClass,
} from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { Controllers } from '../../models/dependency-injection/controller.service';
import { Injector } from '../../models/dependency-injection/injector.service';
import { Modules } from '../../models/dependency-injection/module.service';
import { Providers } from '../../models/dependency-injection/provider.service';
import { CustomProvider } from '../injectable';

interface ProviderOptions {
  type: ProviderType;
}

interface InjectableInterface extends ProviderOptions {
  customProvider?: CustomProvider;
}

// @TODO check why this interface is unused
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
      interceptors: [],
      guards: [],
    });

    Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
  };
};

export const paramBuilder = (
  param: ParamType,
  options?: { paramName?: string; transformer?: TransformerClass },
): ParameterDecorator => {
  const metadataKey = metadataKeys[param];

  return (target, propertyKey, parameterIndex): void => {
    const parameters = Reflect.getMetadata(metadataKey, target.constructor) ?? [];

    parameters.push({
      [propertyKey]: {
        index: parameterIndex,
        param: options?.paramName,
        transformer: options?.transformer,
      },
    });

    Reflect.defineMetadata(metadataKey, parameters, target.constructor);
  };
};

export const moduleBuilder = (module: ModuleDefinition): ClassDecorator => {
  return (target): void => {
    Modules.push(target as unknown as ModuleClass);

    module.controllers.forEach((controller) => Controllers.push(controller));

    // Setting custom providers.
    (module.providers ?? []).forEach((provider) => {
      if (provider.useClass) {
        Providers.addProvider('injectable', {
          name: typeof provider.provider === 'string' ? provider.provider : provider.provider.name,
          clazz: provider.useClass as ClassDeclaration,
        });
      }
    });
  };
};

export const transformerBuilder = (): ClassDecorator => {
  return (target): void => {
    Providers.addProvider('transformer', { name: target.name, clazz: target as unknown as TransformerClass });
  };
};

export const interceptorBuilder = (): ClassDecorator => {
  return (target): void => {
    Providers.addProvider('interceptor', { name: target.name, clazz: target as unknown as InterceptorClass });
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

    Providers.addProvider('injectable', { name, clazz: target as unknown as ProviderClass });
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
