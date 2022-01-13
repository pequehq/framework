import { CanExecute, Injectable } from '../../../dist';

@Injectable()
export class TestGuard implements CanExecute {
  async canExecute(context: any): Promise<boolean> {
    console.log('guard executed');
    return true;
  }
}
