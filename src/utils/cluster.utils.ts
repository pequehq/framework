import cluster, { Worker } from 'cluster';
import { cpus } from 'os';

class ClusterUtils {
  readonly #workers: Record<string, Worker> = {};

  isMaster(): boolean {
    return cluster.isMaster; // @TODO replace: "isMaster" seems to be deprecate
  }

  setupWorkers(): void {
    for (let i = 0; i < this.#numCpus(); i++) {
      this.#spawn();
    }

    cluster.on('exit', (worker) => {
      delete this.#workers[worker.id];
      this.#spawn();
    });
  }

  #spawn(): Worker {
    const worker = cluster.fork();
    this.#workers[worker.id] = worker;
    return worker;
  }

  #numCpus(): number {
    return cpus().length;
  }
}

export const clusterUtils = new ClusterUtils();
