import 'reflect-metadata';
import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import { SwaggerSecuritySchemas } from '../../../decorators/utils/swagger';
import { DECORATORS } from '../../../models/constants/decorators';

export const generateSecuritySchemas = () => {
  const securitySchemas = [...SwaggerSecuritySchemas];
  console.log('\nSecurity Schemas:');
  const securitySchemasGeneratedFolder = path.join(
    __dirname,
    '../../../swagger/components/security-schemes/generated'
  );
  fs.mkdirSync(securitySchemasGeneratedFolder, { recursive: true });

  securitySchemas.forEach(securitySchema => {
    const properties = Reflect.getMetadata(
      `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${securitySchema.name}`,
      securitySchema
    );

    const template = fs.readFileSync(
      path.join(__dirname, '../../../models/mustache/swagger/security-schema.mustache'),
      'utf8'
    );

    const fileName = `${securitySchema.name}.yaml`;
    const object = {name: securitySchema.name, properties};
    const swaggerContent = mustache.render(template, object);

    fs.writeFileSync(
      `${securitySchemasGeneratedFolder}/${fileName}`,
      swaggerContent,
      {encoding: 'utf8'}
    );
    console.log(`  - ${securitySchema.name}: ${securitySchema.name}.yaml`);
  });
}
