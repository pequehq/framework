import { Context } from './context.interface';

export interface CanExecute {
  canExecute(context: Context): Promise<boolean>;
}
