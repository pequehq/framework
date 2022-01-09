---
title: Microservices
has_children: false
nav_order: 8
---

# Microservices
Microservice are a type of architecture (opposite to monolithic) where the application is structured as
a set of services that are in communication in between each other.

![Microservices](images/microservices.png)

In Peque.ts, Microservices are applications that doesn't run via HTTP, and at this moment the available transports are:
- MQTT
- Redis Pub/Sub

The roadmap of transports to be supported is the following:
- Apache Kafka
- Custom brokers

![Microservices in Peque.ts](images/microservice-internal.png)

Microservices, anyway, are provider classes decorated with the `@Microservice()` decorator.

```typescript
@Microservice({ broker: 'mqtt://localhost:1883', transport: 'mqtt' })
export class TestMicroservice extends MicroserviceHandler implements OnProviderInit, OnProviderDestroy {
  start(): void {
    // Start logic, if needed.
  }

  onProviderInit(): void {
    console.log('I have been initialized', TestMicroservice.name);
  }

  onProviderDestroy(): void {
    console.log('I have been destroyed', TestMicroservice.name);
  }

  @ConsumeEvent('test_event')
  test(data: EventPayload<any>) {
    console.log(JSON.stringify(data));
    this.produceEvent();
  }

  @ProduceEvent('produce_test_event')
  produceEvent(data: EventPayload<any>) {
    return { your: 'data'}
  }
  
  produceTestNoDecorator() {
    this.produceEvent('produce_test_event', { your: 'data' });
  }
}
```

# Events

## Consume

Events can be intercepted via the `@ConsumeEvent()` decorator.
There is no need to specify the transport, as the one specified from at microservice level will be used.

## Produce

Events can be produced by the `@ProduceEvent()` decorator or the `this.produceEvent()` method
(inherited by the MicroserviceHandler). The transport, as for the consume event, is inherited by the microservice configuration.
