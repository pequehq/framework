import { randomUUID } from 'crypto';
import { Consumer, Kafka, Message, Producer } from 'kafkajs';

import { BrokerProxy } from '../../models/interfaces/broker-proxy.interface';

interface KafkaClients {
  producer: Producer;
  consumer: Consumer;
}

interface KafkaProducePayload {
  topic: string;
  messages: unknown[];
}

interface KafkaConsumePayload {
  topic: string;
  message: Buffer | null;
}

export class KafkaBrokerClient extends BrokerProxy<unknown> {
  #client: KafkaClients;

  async connect(): Promise<void> {
    const kafka = new Kafka({ clientId: randomUUID(), brokers: [this.broker] });
    this.#client.producer = kafka.producer();
    this.#client.consumer = kafka.consumer();

    await this.#client.producer.connect();
    await this.#client.consumer.connect();
  }

  async publish(payload: KafkaProducePayload): Promise<void> {
    const messages: Message[] = payload.messages.map((message) => ({ value: JSON.stringify(message) }));
    await this.#client.producer.send({ topic: payload.topic, messages });
  }

  async subscribe(cb: (event: KafkaConsumePayload) => void): Promise<void> {
    await this.#client.consumer.subscribe({ topic: /.*/ });
    await this.#client.consumer.run({
      eachMessage: async (payload) => {
        cb({ topic: payload.topic, message: payload.message.value });
      },
    });
  }
}
