import { ModuleDefinition } from '../models';
import { moduleBuilder } from './utils/decorators';

export const Module = (module: ModuleDefinition): ClassDecorator => {
  return moduleBuilder(module);
};
