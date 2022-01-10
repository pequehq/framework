import { ConsumeEvent, EventPayload, MicroserviceHandler, OnProviderDestroy, OnProviderInit } from '../../dist';
import { Microservice } from '../../dist';

@Microservice({ broker: 'mqtt://localhost:1883', transport: 'mqtt' })
export class TestMicroservice extends MicroserviceHandler implements OnProviderInit, OnProviderDestroy {
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
    console.log('ms TestMicroservice.test', JSON.stringify(data));
    this.produce({
      event: 'test_event_produced',
      data: { timestamp: Date.now(), name: 'Simone Di Cicco' },
      timestamp: Date.now(),
    });
  }

  @ConsumeEvent('test_event_produced')
  testConsumeProduced(data: EventPayload<any>) {
    console.log('ms TestMicroservice.testConsumeProduced', JSON.stringify(data));
  }
}
