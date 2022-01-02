import { CanExecute, Injectable } from '../../../dist';

@Injectable()
export class TestServerGuard implements CanExecute {
  async canExecute(context: any): Promise<boolean> {
    console.log('server guard executed');
    return true;
  }
}
