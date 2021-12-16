import cluster, { Worker } from 'cluster';
import * as os from 'os';

const numCPUs = os.cpus().length;
const workers = [];

const spawn = (): Worker => {
  const worker = cluster.fork();
  workers[worker.id] = worker;
  return worker;
};

export const isMaster = (): boolean => {
  return cluster.isMaster;
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
