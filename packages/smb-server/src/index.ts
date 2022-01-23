import { DI } from './di';
import { Broker } from './server/broker.class';

const server = DI.get<Broker>(Broker.name);

const start = async (): Promise<void> => {
  await server.create();
};

start();
