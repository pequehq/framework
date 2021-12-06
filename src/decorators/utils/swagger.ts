import { DECORATORS } from '../../models/constants/decorators';
import { RouteDefinition } from '../../models/_index';
import { SwaggerResponseType } from '../../models/interfaces/swagger/swagger-response-type.interface';
import { SwaggerRouteDefinition } from '../../models/interfaces/swagger/swagger-route-definition.interface';
import { SwaggerResponseDefinition } from '../../models/interfaces/swagger/swagger-response-definition.interface';
import { SWAGGER } from '../../models/constants/swagger';
import { RouteOptions } from '../../models/_index';
import { SwaggerPropertyOptions } from '../../models/interfaces/swagger/swagger-property-options.interface';

export const SwaggerComponents = [];
export const SwaggerResponseBodies = [];
export const SwaggerParameters = [];
export const SwaggerSecuritySchemas = [];

export const swaggerComponentBuilder = (
  isRequestBody = false
): ClassDecorator => {
  return (target: any) => {
    isRequestBody
      ? SwaggerResponseBodies.push(target)
      : SwaggerComponents.push(target);
  };
};

export const swaggerTagBuilder = (tag: string[]): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata(DECORATORS.metadata.swagger.TAGS, tag, target);

    if (!Reflect.hasMetadata(DECORATORS.metadata.swagger.ROUTES, target)) {
      Reflect.defineMetadata(DECORATORS.metadata.swagger.ROUTES, [], target);
    }
  };
};

export const swaggerDtoPropertyBuilder = (
  options: SwaggerPropertyOptions,
  object: any = undefined
): PropertyDecorator => {
  return (target, propertyKey: string | symbol): void => {
    let ref,
      multipleRefs = false;
    if (Array.isArray(object)) {
      multipleRefs = true;
      ref = object.map(el => ({
        refPath: `${SWAGGER.refs.COMPONENTS_SCHEMA.replace(
          '{{DTO}}',
          el.name
        )}`
      }));
    }
    const property = {
      name: propertyKey,
      type: options.type,
      isEnum: options.enum !== undefined,
      arrayType: options.arrayType,
      isArrayObject: object !== undefined,
      enum: options.enum,
      example:
        options.example !== undefined
          ? JSON.stringify(options.example)
          : undefined,
      description: options.description ? options.description : undefined,
      multipleRefs,
      ref:
        ref ||
        (object
          ? `${SWAGGER.refs.COMPONENTS_SCHEMA.replace(
            '{{DTO}}',
            object.name
          )}`
          : undefined),
      isRef: object !== undefined, // Inverted logic for Mustache template.
      isArray: options.type === 'array',
      required: options.required,
      object
    };
    const key = `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${target.constructor.name}`;
    const properties = Reflect.getMetadata(key, target.constructor) || [];
    properties.push(property);
    Reflect.defineMetadata(key, properties, target.constructor);
  };
};

export const swaggerResponseBuilder = (
  options: RouteOptions,
  responseTypes: SwaggerResponseType[]
): MethodDecorator => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): void => {
    if (
      !Reflect.hasMetadata(
        DECORATORS.metadata.swagger.ROUTES,
        target.constructor
      )
    ) {
      Reflect.defineMetadata(
        DECORATORS.metadata.swagger.ROUTES,
        [],
        target.constructor
      );
    }

    const routes: RouteDefinition[] = Reflect.getMetadata(
      DECORATORS.metadata.ROUTES,
      target.constructor
    );
    const swaggerRoutes: SwaggerRouteDefinition[] = Reflect.getMetadata(
      DECORATORS.metadata.swagger.ROUTES,
      target.constructor
    );

    const responses: SwaggerResponseDefinition[] = [];
    responseTypes.forEach(responseType => {
      responses.push({
        content: responseType.content,
        description: responseType.description,
        statusCode: responseType.statusCode,
        object: responseType.object ? responseType.object.name : undefined,
        refPath: responseType.object
          ? SWAGGER.refs.PATHS_SCHEMA.replace(
            '{{DTO}}',
            responseType.object.name
          )
          : undefined,
        example: responseType.example
      });
    });

    // Adjust Route options.
    options.parameters?.forEach((parameter, index, array) => {
      array[index] = `${SWAGGER.refs.PATHS_PARAMETERS}${parameter}`;
    });
    options.requestBody = options.requestBody
      ? `${SWAGGER.refs.PATHS_SCHEMA.replace(
        '{{DTO}}',
        options.requestBody.name
      )}`
      : undefined;

    options.content = options.content
      ? options.content
      : 'application/json; charset=utf-8';

    swaggerRoutes.push({
      options,
      responses,
      route: routes[routes.length - 1]
    });

    Reflect.defineMetadata(
      DECORATORS.metadata.swagger.ROUTES,
      swaggerRoutes,
      target.constructor
    );
  };
};

export const swaggerParameterBuilder = (): ClassDecorator => {
  return (target: any) => {
    SwaggerParameters.push(target);
  }
};

export const swaggerSecuritySchemaBuilder = (): ClassDecorator => {
  return (target: any) => {
    SwaggerSecuritySchemas.push(target);
  }
};
