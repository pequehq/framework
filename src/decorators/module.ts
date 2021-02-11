import { ModuleDefinition } from '../models/_index';
import { moduleBuilder } from './utils/decorators';

export const Module = (module: ModuleDefinition) => {
  return moduleBuilder(module);
}
