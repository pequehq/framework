import 'reflect-metadata';

import {
  ClassDeclaration,
  ControllerDefinition,
  ExpressMethods,
  InterceptorClass,
  MicroserviceClass,
  MicroserviceOptions,
  MiddlewareClass,
  ModuleClass,
  ModuleDefinition,
  ParamDefinition,
  ParamType,
  ProviderClass,
  RouteDefinition,
  TransformerClass,
} from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { Controllers } from '../../models/dependency-injection/controller.service';
import { Injector } from '../../models/dependency-injection/dependency-injection.service';
import { Modules } from '../../models/dependency-injection/module.service';
import { ProviderDefinition } from '../../models/interfaces/provider-definition.interface';
import { CustomProvider } from '../injectable';

interface InjectableInterface {
  customProvider?: CustomProvider;
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
  return (Reflect.getMetadata(metadataKeys[param], target.constructor) ?? [])
    .map((param) => param[propertyKey])
    .filter(Boolean);
};

export const controllerBuilder = (prefix: string): ClassDecorator => {
  return (target): void => {
    const controllerDefinition: ControllerDefinition = {
      prefix,
      middlewares: [],
      guards: [],
      interceptors: [],
    };

    Reflect.defineMetadata(DECORATORS.metadata.CONTROLLER, controllerDefinition, target);

    if (!Reflect.hasMetadata(DECORATORS.metadata.ROUTES, target)) {
      Reflect.defineMetadata(DECORATORS.metadata.ROUTES, [], target);
    }
  };
};

export const methodBuilder = (method: ExpressMethods, path: string, documentOnly: boolean): MethodDecorator => {
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
      middlewareFunctions: [],
      documentOnly,
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

    for (const controller of module.controllers) {
      Controllers.push(controller);
    }

    // Setting custom providers.
    for (const provider of module.providers ?? []) {
      const providerDefinition = provider as ProviderDefinition;
      if (providerDefinition.useClass) {
        Injector.add({
          name:
            typeof providerDefinition.provider === 'string'
              ? providerDefinition.provider
              : providerDefinition.provider.name,
          clazz: providerDefinition.useClass as ClassDeclaration,
          type: 'injectable',
        });
      }
    }
  };
};

export const microserviceBuilder = (options: MicroserviceOptions): ClassDecorator => {
  return (target): void => {
    Reflect.defineMetadata(DECORATORS.metadata.microservice.OPTIONS, options, target);
    const callbacks: any[] = Reflect.getMetadata(DECORATORS.metadata.events.METHODS_CB, target) || [];
    for (const fn of callbacks) {
      fn(options.transport);
    }
    Injector.add({ name: target.name, clazz: target as unknown as MicroserviceClass, type: 'microservice' });
  };
};

export const transformerBuilder = (): ClassDecorator => {
  return (target): void => {
    Injector.add({ name: target.name, clazz: target as unknown as TransformerClass, type: 'transformer' });
  };
};

export const middlewareBuilder = (): ClassDecorator => {
  return (target): void => {
    Injector.add({ name: target.name, clazz: target as unknown as MiddlewareClass, type: 'middleware' });
  };
};

export const interceptorBuilder = (): ClassDecorator => {
  return (target): void => {
    Injector.add({ name: target.name, clazz: target as unknown as InterceptorClass, type: 'interceptor' });
  };
};

export const injectableBuilder = (options: InjectableInterface): ClassDecorator => {
  return (target): void => {
    let name = target.name;

    if (options.customProvider?.interface) {
      name = options.customProvider.interface;
    }

    Injector.add({ name, clazz: target as unknown as ProviderClass, type: 'injectable' });
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
