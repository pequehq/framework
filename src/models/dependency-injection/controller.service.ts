import { Injector } from './injector.service';

export class ControllerService {
  private controllers = [];

  push(controller: any) {
    this.controllers.push(controller);
  }

  getAll() {
    return this.controllers;
  }
}

Injector.set('ControllerService', ControllerService);
export const Controllers = Injector.resolve('ControllerService');
