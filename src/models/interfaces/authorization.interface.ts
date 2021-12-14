export interface CanExecute {
  canExecute(context: any): Promise<boolean>;
}
