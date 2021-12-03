import { ControllerService } from '../src/models/dependency-injection/controller.service';

describe('ControllerService', () => {
  class TestControllerOne {}
  class TestControllerTwo {}

  const controllerService = new ControllerService();

  const controllers = [TestControllerOne, TestControllerTwo];
  it('should push the Controllers into an array and return the same list', () => {
    controllerService.push(TestControllerOne);
    controllerService.push(TestControllerTwo);
    expect(controllers).toEqual(controllerService.getAll());
  });
});
