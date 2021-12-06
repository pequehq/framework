import 'reflect-metadata';
import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import { Controllers } from '../../../models/dependency-injection/controller.service';
import { DECORATORS } from '../../../models/constants/decorators';
import { ControllerDefinition } from '../../../models/controller-definition.interface';
import { SwaggerRouteDefinition } from '../../../models/interfaces/swagger/swagger-route-definition.interface';
import { swaggerReplaceQueryParamsWithCurlyBrackets } from '../../../utils/express/factory';
import { SwaggerSecurityType } from '../../../models/interfaces/types';
import { SWAGGER } from '../../../models/constants/swagger';

export const generateControllers = () => {
  console.log('\nControllers:');
  const controllers = Controllers.getAll()

// Prepping the old paths.
  const pathsPath = path.join(__dirname, '../../../swagger/paths/paths-generated.yaml');
  // const oldPathsPath = path.join(__dirname, '../swagger/paths/paths.yaml');
  // const oldPathsContent = fs.readFileSync(oldPathsPath, { encoding: 'utf8' });
  // fs.writeFileSync(pathsPath, oldPathsContent, { encoding: 'utf8' });

// Iterate controllers.
  const pathGeneratedGFolder = path.join(__dirname, `../../../swagger/paths/generated`);
  fs.mkdirSync(pathGeneratedGFolder, { recursive: true });

  controllers.forEach(controller => {
    const tags = Reflect.getMetadata(
      DECORATORS.metadata.swagger.TAGS,
      controller
    );
    const controllerMeta: ControllerDefinition = Reflect.getMetadata(
      DECORATORS.metadata.CONTROLLER,
      controller
    );
    const routes: SwaggerRouteDefinition[] = Reflect.getMetadata(
      DECORATORS.metadata.swagger.ROUTES,
      controller
    ) || [];

    const methodTemplate = fs.readFileSync(
      path.join(__dirname, '../../../models/mustache/swagger/method.mustache'),
      'utf8'
    );
    const pathTemplate = fs.readFileSync(
      path.join(__dirname, '../../../models/mustache/swagger/path.mustache'),
      'utf8'
    );
    const controllerName = controller.name
      .replace('Controller', '')
      .toLocaleLowerCase();

    console.log(`  ${controllerName}:`);

    const routesByPath = routes.reduce((acc, route) => {
      (acc[route.route.path] = acc[route.route.path] || []).push(route);
      return acc;
    }, {});

    Object.entries(routesByPath).forEach(
      ([actualPath, actualRoutes]: [string, SwaggerRouteDefinition[]]) => {
        // Replace parameters colon with curly brackets.
        const pathUrl = swaggerReplaceQueryParamsWithCurlyBrackets(
          `${controllerMeta.prefix}${actualPath}`
        );

        const pathObject = {
          path: pathUrl,
          routes: []
        };

        actualRoutes.forEach(route => {
          const fileName = `${controllerName}-${route.options.operationId}.yaml`;
          const controllerFolder = path.join(
            __dirname,
            `../../../swagger/paths/generated/${controllerName}`
          );
          const routePath = path.join(
            __dirname,
            `../../../swagger/paths/generated/${controllerName}/${fileName}`
          );
          const methodObject = {
            route,
            method: route.route.requestMethod,
            prefix: tags,
            options: route.options,
            security: route.options.security,
            isSecurityOptional:
              route.options.security !== undefined &&
              route.options.security.includes(SwaggerSecurityType.OPTIONAL)
          };

          pathObject.routes.push({
            ref: `${SWAGGER.refs.PATHS_CONTROLLERS}${controllerName}/${fileName}`,
            method: route.route.requestMethod
          });

          const swaggerContent = mustache.render(methodTemplate, methodObject);

          if (!fs.existsSync(controllerFolder)) {
            fs.mkdirSync(controllerFolder);
          }
          fs.writeFileSync(routePath, swaggerContent, { encoding: 'utf8' });

          console.log(`    - ${pathObject.path}: ${controllerName}/${fileName}`);
        });
        const pathContent = mustache.render(pathTemplate, pathObject);
        fs.appendFileSync(pathsPath, pathContent, { encoding: 'utf8' });
      }
    );
  });
}
