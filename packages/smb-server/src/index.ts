import { DI, loadProviders } from './di';
import { Broker } from './server/broker.class';

// Loading DI.
loadProviders();

const server = DI.get<Broker>(Broker.name);

const start = async (): Promise<void> => {
  await server.create();
};

start();
