import { Injectable } from '../../../src/decorators/injectable';
import { CanExecute } from '../../../src/models/interfaces/authorization.interface';

@Injectable()
export class TestServerGuard implements CanExecute {
  async canExecute(context: any): Promise<boolean> {
    console.log('server guard executed');
    return true;
  }
}
