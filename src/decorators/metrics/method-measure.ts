import { performance } from 'perf_hooks';
import { MethodMetrics } from '../../models/interfaces/metrics/method-metrics.interface';

export const MethodMeasure = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = (...args) => {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const finish = performance.now();
      const measure: MethodMetrics = {
        result,
        executionTime: finish - start
      };
      console.log(measure);
      return result;
    };

    return descriptor;
  };
};
