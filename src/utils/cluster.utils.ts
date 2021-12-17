import cluster, { Worker } from 'cluster';
import { cpus } from 'os';

const numCPUs = cpus().length;
const workers: Record<string, Worker> = {};

const spawn = (): Worker => {
  const worker = cluster.fork();
  workers[worker.id] = worker;
  return worker;
};

export const isMaster = (): boolean => {
  return cluster.isMaster; // @TODO replace: "isMaster" seems to be deprecate
};

export const setupWorkers = (): void => {
  for (let i = 0; i < numCPUs; i++) {
    spawn();
  }

  cluster.on('exit', (worker) => {
    delete workers[worker.id];
    spawn();
  });
};
