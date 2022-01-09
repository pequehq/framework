import { ConsumeEvent, EventPayload, MicroserviceHandler, OnProviderDestroy, OnProviderInit } from '../../dist';
import { Microservice } from '../../dist';

@Microservice({ broker: 'redis://localhost:6379', transport: 'redis' })
export class TestRedisMicroservice implements MicroserviceHandler, OnProviderInit, OnProviderDestroy {
  start(): void {
    // setInterval(() => console.log('Microservice', Date.now()), 3000);
  }

  onProviderInit(): void {
    console.log('I have been initialized', TestRedisMicroservice.name);
  }

  onProviderDestroy(): void {
    console.log('I have been destroyed', TestRedisMicroservice.name);
  }

  @ConsumeEvent('test_event')
  test(data: EventPayload<any>) {
    console.log('redis on event', JSON.stringify(data));
  }
}
