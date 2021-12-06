import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import { SwaggerResponseBodies } from '../../../decorators/utils/swagger';
import { DECORATORS } from '../../../models/constants/decorators';
import { appendSchemaObject } from '../../swagger-factory';

export const generateRequestBodies = () => {
  const requestBodies = [...SwaggerResponseBodies];
  console.log('\nRequest bodies:');
  const requestBodiesGeneratedFolder = path.join(
    __dirname,
    '../../../swagger/components/request-bodies/generated'
  );
  fs.mkdirSync(requestBodiesGeneratedFolder, { recursive: true });

  requestBodies.forEach(requestBody => {
    const properties = Reflect.getMetadata(
      `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${requestBody.name}`,
      requestBody
    );
    const template = fs.readFileSync(
      path.join(__dirname, '../../../models/mustache/swagger/request-body.mustache'),
      'utf8'
    );

    const fileName = `${requestBody.name}.yaml`;
    const object = {name: requestBody.name, properties};
    const swaggerContent = mustache.render(template, object);

    fs.writeFileSync(
      `${requestBodiesGeneratedFolder}/${fileName}`,
      swaggerContent,
      {encoding: 'utf8'}
    );
    appendSchemaObject(requestBody, '../request-bodies/generated/');
    console.log(`  - ${requestBody.name}: ${requestBody.name}.yaml`);
  });
}
