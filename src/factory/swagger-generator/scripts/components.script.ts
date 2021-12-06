import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import { SwaggerComponents } from '../../decorators/_index';
import { DECORATORS } from '../../models/constants/decorators';
import { appendSchemaObject } from '../index';

export const generateComponents = () => {
  const components = [...SwaggerComponents];

  console.log('Components:');
  const componentGeneratedFolder = path.join(
    __dirname,
    '../swagger/components/schemas/generated'
  );
  if (!fs.existsSync(componentGeneratedFolder)) {
    fs.mkdirSync(componentGeneratedFolder);
  }
  components.forEach(component => {
    // Looks for any parent DTO.
    console.log(component.name);
    const parentTarget = Object.getPrototypeOf(component.prototype).constructor;
    const parentProperties =
      Reflect.getMetadata(
        `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${parentTarget.name}`,
        parentTarget
      ) || [];

    let properties =
      Reflect.getMetadata(
        `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${component.name}`,
        component
      ) || [];

    // Merging all properties around extended DTOs
    properties = [...properties, ...parentProperties];
    const template = fs.readFileSync(
      path.join(__dirname, '../models/mustache/swagger/component.mustache'),
      'utf8'
    );
    const fileName = `${component.name}.yaml`;
    const requiredFields = properties
      ? properties.filter(property => property.required)
      : [];
    const componentObject = {name: component.name, properties, requiredFields};
    const componentContent = mustache.render(template, componentObject);

    fs.writeFileSync(
      `${componentGeneratedFolder}/${fileName}`,
      componentContent,
      {
        encoding: 'utf8'
      }
    );
    appendSchemaObject(component, './generated/');
    console.log(`  - ${component.name}: ${component.name}.yaml`);
  });

}
