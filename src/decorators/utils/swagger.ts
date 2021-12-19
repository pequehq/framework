import { ClassDeclaration, RouteDefinition, RouteOptions } from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { SWAGGER } from '../../models/constants/swagger';
import { SwaggerPropertyOptions } from '../../models/interfaces/swagger/swagger-property-options.interface';
import { SwaggerResponseDefinition } from '../../models/interfaces/swagger/swagger-response-definition.interface';
import { SwaggerResponseType } from '../../models/interfaces/swagger/swagger-response-type.interface';
import { SwaggerRouteDefinition } from '../../models/interfaces/swagger/swagger-route-definition.interface';

export const SwaggerComponents: ClassDeclaration[] = [];
export const SwaggerResponseBodies: ClassDeclaration[] = [];
export const SwaggerParameters: ClassDeclaration[] = [];
export const SwaggerSecuritySchemas: ClassDeclaration[] = [];

export const swaggerComponentBuilder = (isRequestBody = false): ClassDecorator => {
  return (target): void => {
    isRequestBody
      ? SwaggerResponseBodies.push(target as unknown as ClassDeclaration)
      : SwaggerComponents.push(target as unknown as ClassDeclaration);
  };
};

export const swaggerTagBuilder = (tag: string[]): ClassDecorator => {
  return (target): void => {
    Reflect.defineMetadata(DECORATORS.metadata.swagger.TAGS, tag, target);

    if (!Reflect.hasMetadata(DECORATORS.metadata.swagger.ROUTES, target)) {
      Reflect.defineMetadata(DECORATORS.metadata.swagger.ROUTES, [], target);
    }
  };
};

export const swaggerDtoPropertyBuilder = (options: SwaggerPropertyOptions, object?: unknown): PropertyDecorator => {
  return (target, propertyKey): void => {
    let ref,
      multipleRefs = false;
    if (Array.isArray(object)) {
      multipleRefs = true;
      ref = object.map((el) => ({
        refPath: `${SWAGGER.refs.COMPONENTS_SCHEMA.replace('{{DTO}}', el.name)}`,
      }));
    }

    const property = {
      name: propertyKey,
      type: options.type,
      isEnum: options.enum !== undefined,
      arrayType: options.arrayType,
      isArrayObject: object !== undefined,
      enum: options.enum,
      example: options.example !== undefined ? JSON.stringify(options.example) : undefined,
      description: options.description ? options.description : undefined,
      multipleRefs,
      ref: ref || (object ? `${SWAGGER.refs.COMPONENTS_SCHEMA.replace('{{DTO}}', (object as any).name)}` : undefined),
      isRef: object !== undefined, // Inverted logic for Mustache template.
      isArray: options.type === 'array',
      required: options.required,
      object,
    };

    const key = `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${target.constructor.name}`;
    const properties = Reflect.getMetadata(key, target.constructor) || [];
    properties.push(property);
    Reflect.defineMetadata(key, properties, target.constructor);
  };
};

export const swaggerResponseBuilder = (
  options: RouteOptions,
  responseTypes: SwaggerResponseType[],
): MethodDecorator => {
  return (target): void => {
    if (!Reflect.hasMetadata(DECORATORS.metadata.swagger.ROUTES, target.constructor)) {
      Reflect.defineMetadata(DECORATORS.metadata.swagger.ROUTES, [], target.constructor);
    }

    const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor);
    const swaggerRoutes: SwaggerRouteDefinition[] = Reflect.getMetadata(
      DECORATORS.metadata.swagger.ROUTES,
      target.constructor,
    );

    const responses: SwaggerResponseDefinition[] = [];
    responseTypes.forEach((responseType) => {
      responses.push({
        content: responseType.content,
        description: responseType.description,
        statusCode: responseType.statusCode,
        object: responseType.object ? responseType.object.name : undefined,
        refPath: responseType.object ? SWAGGER.refs.PATHS_SCHEMA.replace('{{DTO}}', responseType.object.name) : '',
        example: responseType.example,
      });
    });

    // Adjust Route options.
    options.parameters?.forEach((parameter, index, array) => {
      array[index] = `${SWAGGER.refs.PATHS_PARAMETERS}${parameter}`;
    });
    options.requestBody = options.requestBody
      ? `${SWAGGER.refs.PATHS_SCHEMA.replace('{{DTO}}', options.requestBody.name)}`
      : undefined;

    options.content = options.content ? options.content : 'application/json; charset=utf-8';

    swaggerRoutes.push({
      options,
      responses,
      route: routes[routes.length - 1],
    });

    Reflect.defineMetadata(DECORATORS.metadata.swagger.ROUTES, swaggerRoutes, target.constructor);
  };
};

export const swaggerParameterBuilder = (): ClassDecorator => {
  return (target): void => {
    SwaggerParameters.push(target as unknown as ClassDeclaration);
  };
};

export const swaggerSecuritySchemaBuilder = (): ClassDecorator => {
  return (target): void => {
    SwaggerSecuritySchemas.push(target as unknown as ClassDeclaration);
  };
};
