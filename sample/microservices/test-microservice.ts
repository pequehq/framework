import { ConsumeEvent, EventPayload, MicroserviceHandler, OnProviderDestroy, OnProviderInit } from '../../dist';
import { Microservice } from '../../dist';
import { TransportQueue } from '../../src/services/microservice/transport-queue.service';

@Microservice({ broker: 'mqtt://localhost:1883', transport: 'mqtt' })
export class TestMicroservice implements MicroserviceHandler, OnProviderInit, OnProviderDestroy {
  start(): void {
    // setInterval(() => console.log('Microservice', Date.now()), 3000);
  }

  onProviderInit(): void {
    console.log('I have been initialized', TestMicroservice.name);
  }

  onProviderDestroy(): void {
    console.log('I have been destroyed', TestMicroservice.name);
  }

  @ConsumeEvent('test_event')
  test(data: EventPayload<any>) {
    console.log('ms on event', JSON.stringify(data));
  }
}
