import { transformerBuilder } from './utils/decorators';

export const Transformer = (): ClassDecorator => {
  return transformerBuilder();
};
