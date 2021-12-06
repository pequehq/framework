import * as mustache from 'mustache';
import { getFile, writeFile } from '../utils/fs.utils';
import { ExpressFactory } from './express-factory';
import { generateComponents } from './swagger-generator/scripts/components.script';
import { generateRequestBodies } from './swagger-generator/scripts/request-bodies.script';
import { generateParameters } from './swagger-generator/scripts/parameters.script';
import { generateSecuritySchemas } from './swagger-generator/scripts/security-schemas-script';
import { generateControllers } from './swagger-generator/scripts/controllers.script';
import fs from 'fs';
import path from 'path';

const INFO_TEMPLATE_PATH = '../models/mustache/swagger/info.mustache';
const INFO_GENERATED_PATH = '../swagger/info.yaml';
const TAGS_TEMPLATE_PATH = '../models/mustache/swagger/tags.mustache';
const TAGS_GENERATED_PATH = '../swagger/tags.yaml';
const SERVERS_TEMPLATE_PATH = '../models/mustache/swagger/servers.mustache';
const SERVERS_GENERATED_PATH = '../swagger/servers.yaml';

const schemasPaths = path.join(
  __dirname,
  '../swagger/components/schemas/schemas-generated.yaml'
);

export const appendSchemaObject = (object, objectPath) => {
  const schemaTemplate = fs.readFileSync(
    path.join(__dirname, '../models/mustache/swagger/schema.mustache'),
    'utf8'
  );

  const schemaObject = {
    name: object.name,
    ref: `${objectPath}${object.name}.yaml`
  };

  const schemaContent = mustache.render(schemaTemplate, schemaObject);
  fs.appendFileSync(schemasPaths, schemaContent, { encoding: 'utf8' });
};

export class SwaggerFactory {
  private static render(templatePath: string, outputPath: string, object: any) {
    const template = getFile(templatePath);
    const content = mustache.render(template, object);
    writeFile(outputPath, content);
  }

  private static createInfoFile() {
    SwaggerFactory.render(
      INFO_TEMPLATE_PATH,
      INFO_GENERATED_PATH,
      { info: ExpressFactory.getServerOptions().swagger.info }
    );
  }

  private static createTagsFile() {
    SwaggerFactory.render(
      TAGS_TEMPLATE_PATH,
      TAGS_GENERATED_PATH,
      { tags: ExpressFactory.getServerOptions().swagger.tags }
    );
  }

  private static createServersFile() {
    SwaggerFactory.render(
      SERVERS_TEMPLATE_PATH,
      SERVERS_GENERATED_PATH,
      { servers: ExpressFactory.getServerOptions().swagger.servers }
    );
  }

  private static createComponentsFile() {
    generateComponents();
  }

  private static createRequestBodiesFile() {
    generateRequestBodies();
  }

  private static createParametersFile() {
    generateParameters();
  }

  private static createSecuritySchemas() {
    generateSecuritySchemas();
  }

  private static createControllers() {
    generateControllers();
  }

  generate() {
    SwaggerFactory.createInfoFile();
    SwaggerFactory.createTagsFile();
    SwaggerFactory.createServersFile();
    SwaggerFactory.createComponentsFile();
    SwaggerFactory.createRequestBodiesFile();
    SwaggerFactory.createParametersFile();
    SwaggerFactory.createSecuritySchemas();
    SwaggerFactory.createControllers();
  }
}
