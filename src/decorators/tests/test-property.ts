import { DECORATORS } from '../../models/constants/decorators';

export const TestProperty = (optional = false): PropertyDecorator => {
  return (target, propertyKey: string): void => {
    const property = {
      name: propertyKey,
      optional
    };
    const properties =
      Reflect.getMetadata(
        DECORATORS.metadata.TEST_PROPERTIES,
        target.constructor
      ) || [];
    properties.push(property);
    Reflect.defineMetadata(
      DECORATORS.metadata.TEST_PROPERTIES,
      properties,
      target.constructor
    );
  };
};
