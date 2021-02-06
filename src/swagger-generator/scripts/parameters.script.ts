import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import { SwaggerParameters } from '../../decorators';
import { DECORATORS } from '../../models/constants/decorators';

export const generateParameters = () => {
  const parameters = [...SwaggerParameters];
  console.log('\nParameters:');
  const parametersGeneratedFolder = path.join(
    __dirname,
    '../swagger/components/parameters/generated'
  );
  if (!fs.existsSync(parametersGeneratedFolder)) {
    fs.mkdirSync(parametersGeneratedFolder);
  }
  parameters.forEach(parameter => {
    const properties = Reflect.getMetadata(
      `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${parameter.name}`,
      parameter
    );

    const template = fs.readFileSync(
      path.join(__dirname, '../models/mustache/swagger/parameter.mustache'),
      'utf8'
    );

    const fileName = `${parameter.name}.yaml`;
    const object = {name: parameter.name, properties};
    const swaggerContent = mustache.render(template, object);

    fs.writeFileSync(
      `${parametersGeneratedFolder}/${fileName}`,
      swaggerContent,
      {encoding: 'utf8'}
    );
    console.log(`  - ${parameter.name}: ${parameter.name}.yaml`);
  });
}
