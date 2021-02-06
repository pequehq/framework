import 'reflect-metadata';
import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import { generateParameters } from './scripts/parameters.script';
import { generateComponents } from './scripts/components.script';
import { generateRequestBodies } from './scripts/request-bodies.script';
import { generateControllers } from './scripts/controllers.script';
import { generateSecuritySchemas } from './scripts/security-schemas-script';

// Prepping the old schemas.
const schemasPaths = path.join(
  __dirname,
  '../swagger/components/schemas/schemas-generated.yaml'
);
const oldSchemasPath = path.join(
  __dirname,
  '../swagger/components/schemas/_index.yaml'
);
const oldSchemasContent = fs.readFileSync(oldSchemasPath, { encoding: 'utf8' });
fs.writeFileSync(schemasPaths, oldSchemasContent, { encoding: 'utf8' });

// Appends Component objects into a general generated schema.
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

generateComponents();
generateRequestBodies();
generateParameters();
generateSecuritySchemas();
generateControllers();

console.log('\nCompleted.');
process.exit(0);
