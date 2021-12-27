import { Injectable } from '../../../src';
import { CanExecute } from '../../../src/models/interfaces/authorization.interface';

@Injectable()
export class TestGuard implements CanExecute {
  async canExecute(context: any): Promise<boolean> {
    console.log('guard executed');
    return true;
  }
}
