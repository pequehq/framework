import * as mustache from 'mustache';

import {
  SwaggerComponents,
  SwaggerParameters,
  SwaggerResponseBodies,
  SwaggerSecuritySchemas,
} from '../decorators';
import { DECORATORS } from '../models/constants/decorators';
import { SWAGGER } from '../models/constants/swagger';
import { ControllerDefinition } from '../models';
import { Controllers } from '../models/dependency-injection/controller.service';
import { SwaggerRouteDefinition } from '../models/interfaces/swagger/swagger-route-definition.interface';
import { ExpressMethods } from '../models';
import { swaggerReplaceQueryParamsWithCurlyBrackets } from '../utils/express/factory';
import { appendFile, getFile, getPath, removeFolder, writeFile } from '../utils/fs.utils';
import { ExpressFactory } from './express-factory';

const GENERATED_FOLDER = '../swagger/generated';
const TEMPLATE_FOLDER = '../models/mustache/swagger';
const SCHEMAS_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/schema.mustache`;
const SCHEMAS_GENERATED_PATH = `${GENERATED_FOLDER}/components/schemas/schemas-generated.yaml`;
const COMPONENTS_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/component.mustache`;
const COMPONENTS_GENERATED_PATH = `${GENERATED_FOLDER}/components/schemas/generated`;
const REQUEST_BODIES_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/request-body.mustache`;
const REQUEST_BODIES_GENERATED_PATH = `${GENERATED_FOLDER}/components/request-bodies/generated`;
const PARAMETERS_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/parameter.mustache`;
const PARAMETERS_GENERATED_PATH = `${GENERATED_FOLDER}/components/parameters/generated`;
const SEC_SCHEMAS_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/security-schema.mustache`;
const SEC_SCHEMAS_GENERATED_PATH = `${GENERATED_FOLDER}/components/security-schemes/generated`;
const PATHS_METHOD_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/method.mustache`;
const PATHS_PATH_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/path.mustache`;
const PATHS_GENERATED_PATH = `${GENERATED_FOLDER}/paths/paths-generated.yaml`;
const PATHS_GENERATED_FOLDER_PATH = `${GENERATED_FOLDER}/paths/generated`;
const INFO_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/info.mustache`;
const INFO_GENERATED_PATH = `${GENERATED_FOLDER}/info.yaml`;
const TAGS_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/tags.mustache`;
const TAGS_GENERATED_PATH = `${GENERATED_FOLDER}/tags.yaml`;
const SERVERS_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/servers.mustache`;
const SERVERS_GENERATED_PATH = `${GENERATED_FOLDER}/servers.yaml`;
const BASE_DOC_TEMPLATE_PATH = `${TEMPLATE_FOLDER}/base-swagger-doc.mustache`;
const BASE_DOC_GENERATED_PATH = `${GENERATED_FOLDER}/base-swagger-doc.yaml`;

const BASE_DOC = {
  parameters: false,
  requestBodies: false,
  schemas: false,
  responses: false,
  securitySchemes: false,
};

export class SwaggerFactory {
  private static resetBaseDoc(): void {
    BASE_DOC.parameters = false;
    BASE_DOC.requestBodies = false;
    BASE_DOC.schemas = false;
    BASE_DOC.responses = false;
    BASE_DOC.securitySchemes = false;
  }

  private static render(templatePath: string, outputPath: string, object, append = false): string {
    const template = getFile(templatePath);
    const content = mustache.render(template, object);
    if (append) {
      appendFile(outputPath, content);
    } else {
      writeFile(outputPath, content);
    }

    return content;
  }

  private static appendSchemaObject(object, objectPath): void {
    SwaggerFactory.render(
      SCHEMAS_TEMPLATE_PATH,
      getPath(SCHEMAS_GENERATED_PATH),
      {
        name: object.name,
        ref: `${objectPath}${object.name}.yaml`,
      },
      true,
    );
  }

  private static createInfoFile(): void {
    SwaggerFactory.render(INFO_TEMPLATE_PATH, getPath(INFO_GENERATED_PATH), {
      info: ExpressFactory.getServerOptions().swagger?.info,
    });
  }

  private static createTagsFile(): void {
    SwaggerFactory.render(TAGS_TEMPLATE_PATH, getPath(TAGS_GENERATED_PATH), {
      tags: ExpressFactory.getServerOptions().swagger?.tags,
    });
  }

  private static createServersFile(): void {
    SwaggerFactory.render(SERVERS_TEMPLATE_PATH, getPath(SERVERS_GENERATED_PATH), {
      servers: ExpressFactory.getServerOptions().swagger?.servers,
    });
  }

  private static createComponentsFile(): void {
    const components = [...SwaggerComponents];
    const componentGeneratedFolder = getPath(COMPONENTS_GENERATED_PATH);
    BASE_DOC.schemas = components.length > 0;

    components.forEach((component) => {
      // Looks for any parent DTO.
      const parentTarget = Object.getPrototypeOf(component.prototype).constructor;
      const parentProperties =
        Reflect.getMetadata(`${DECORATORS.metadata.swagger.DTO_PROPERTY}_${parentTarget.name}`, parentTarget) || [];

      let properties =
        Reflect.getMetadata(`${DECORATORS.metadata.swagger.DTO_PROPERTY}_${component.name}`, component) || [];

      // Merging all properties around extended DTOs
      properties = [...properties, ...parentProperties];
      const fileName = `${component.name}.yaml`;
      const requiredFields = properties ? properties.filter((property) => property.required) : [];
      const componentObject = { name: component.name, properties, requiredFields };
      SwaggerFactory.render(COMPONENTS_TEMPLATE_PATH, `${componentGeneratedFolder}/${fileName}`, componentObject);
      SwaggerFactory.appendSchemaObject(component, './generated/');
    });
  }

  private static createRequestBodiesFile(): void {
    const requestBodies = [...SwaggerResponseBodies];
    const requestBodiesGeneratedFolder = getPath(REQUEST_BODIES_GENERATED_PATH);
    BASE_DOC.requestBodies = requestBodies.length > 0;

    requestBodies.forEach((requestBody) => {
      const properties = Reflect.getMetadata(
        `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${requestBody.name}`,
        requestBody,
      );

      const fileName = `${requestBody.name}.yaml`;
      const object = { name: requestBody.name, properties };
      SwaggerFactory.render(REQUEST_BODIES_TEMPLATE_PATH, `${requestBodiesGeneratedFolder}/${fileName}`, object);
      SwaggerFactory.appendSchemaObject(requestBody, '../request-bodies/generated/');
    });
  }

  private static createParametersFile(): void {
    const parameters = [...SwaggerParameters];
    const parametersGeneratedFolder = getPath(PARAMETERS_GENERATED_PATH);
    BASE_DOC.parameters = parameters.length > 0;

    parameters.forEach((parameter) => {
      const properties = Reflect.getMetadata(
        `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${parameter.name}`,
        parameter,
      );

      const fileName = `${parameter.name}.yaml`;
      const object = { name: parameter.name, properties };
      SwaggerFactory.render(PARAMETERS_TEMPLATE_PATH, `${parametersGeneratedFolder}/${fileName}`, object);
    });
  }

  private static createSecuritySchemas(): void {
    const securitySchemes = [...SwaggerSecuritySchemas];
    const securitySchemesGeneratedFolder = getPath(SEC_SCHEMAS_GENERATED_PATH);
    BASE_DOC.securitySchemes = securitySchemes.length > 0;

    securitySchemes.forEach((securitySchema) => {
      const properties = Reflect.getMetadata(
        `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${securitySchema.name}`,
        securitySchema,
      );

      const fileName = `${securitySchema.name}.yaml`;
      const object = { name: securitySchema.name, properties };
      SwaggerFactory.render(SEC_SCHEMAS_TEMPLATE_PATH, `${securitySchemesGeneratedFolder}/${fileName}`, object);
    });
  }

  private static createControllers(): void {
    const controllers = Controllers.getAll();

    // Iterate controllers.
    controllers.forEach((controller) => {
      const tags = Reflect.getMetadata(DECORATORS.metadata.swagger.TAGS, controller);
      const controllerMeta: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, controller);
      const routes: SwaggerRouteDefinition[] =
        Reflect.getMetadata(DECORATORS.metadata.swagger.ROUTES, controller) ?? [];

      const controllerName = controller.name.replace('Controller', '').toLocaleLowerCase();

      const routesByPath = routes.reduce<Record<string, SwaggerRouteDefinition[]>>((acc, route) => {
        (acc[route.route.path] = acc[route.route.path] ?? []).push(route);
        return acc;
      }, {});

      Object.entries(routesByPath).forEach(([actualPath, actualRoutes]: [string, SwaggerRouteDefinition[]]) => {
        // Replace parameters colon with curly brackets.
        const path = swaggerReplaceQueryParamsWithCurlyBrackets(`${controllerMeta.prefix}${actualPath}`);
        const routes: { ref: string; method: ExpressMethods }[] = [];

        actualRoutes.forEach((route) => {
          const fileName = `${controllerName}-${route.options.operationId}.yaml`;
          const methodObject = {
            route,
            method: route.route.requestMethod,
            prefix: tags,
            options: route.options,
            security: route.options.security,
            isSecurityOptional: route.options.security === undefined,
          };

          routes.push({
            ref: `${SWAGGER.refs.PATHS_CONTROLLERS}${controllerName}/${fileName}`,
            method: route.route.requestMethod,
          });

          SwaggerFactory.render(
            PATHS_METHOD_TEMPLATE_PATH,
            getPath(`${PATHS_GENERATED_FOLDER_PATH}/${controllerName}/${fileName}`),
            methodObject,
          );
        });

        SwaggerFactory.render(PATHS_PATH_TEMPLATE_PATH, getPath(PATHS_GENERATED_PATH), { path, routes }, true);
      });
    });
  }

  private static createBaseDoc(): void {
    SwaggerFactory.render(BASE_DOC_TEMPLATE_PATH, getPath(BASE_DOC_GENERATED_PATH), BASE_DOC);
  }

  generate(): void {
    removeFolder(GENERATED_FOLDER);
    SwaggerFactory.resetBaseDoc();
    SwaggerFactory.createInfoFile();
    SwaggerFactory.createTagsFile();
    SwaggerFactory.createServersFile();
    SwaggerFactory.createComponentsFile();
    SwaggerFactory.createRequestBodiesFile();
    SwaggerFactory.createParametersFile();
    SwaggerFactory.createSecuritySchemas();
    SwaggerFactory.createControllers();
    SwaggerFactory.createBaseDoc();
  }
}
