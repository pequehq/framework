import {
  ConsumeEvent,
  EventPayload,
  Microservice,
  MicroserviceHandler,
  OnProviderDestroy,
  OnProviderInit,
} from '../../dist';

@Microservice({ broker: 'redis://localhost:6379', transport: 'redis' })
export class TestRedisMicroservice extends MicroserviceHandler implements OnProviderInit, OnProviderDestroy {
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
