import { TransformerClass } from './types';

export interface ParamDefinition {
  index: number;
  param: string;
  transformer?: TransformerClass;
}
