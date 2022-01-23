import { randomUUID } from 'crypto';
import { createServer, Server } from 'net';
import { Injectable } from 'peque-di';
import { Command, EventService, IBrokerSocket, SocketService } from 'peque-smb-commons/src';

import { MessageCommand, PublishCommand, SubscribeCommand, WelcomeCommand } from '../commands';

@Injectable()
export class Broker {
  #server: Server;
  #port = Number(process.env.PORT) ?? 8888;
  #hostname: string = process.env.HOSTNAME ?? '127.0.0.1';

  constructor(
    private sockets: SocketService,
    private events: EventService,
    private command: Command,
    private welcomeCommand: WelcomeCommand,
    private subscribeCommand: SubscribeCommand,
    private messageCommand: MessageCommand,
    private publishCommand: PublishCommand,
  ) {
    this.command.init([this.welcomeCommand, this.subscribeCommand, this.messageCommand, this.publishCommand]);
  }

  create(): Promise<void> {
    this.#server = createServer();

    this.#server.on('connection', (socket: IBrokerSocket) => {
      socket.id = randomUUID();
      socket.on('data', (data) => this.events.next('incomingCommand', data));
      this.sockets.set(socket.id, socket);
      this.events.next('welcome', {
        command: 'welcome',
        socketId: socket.id,
        action: '',
        issueTimestamp: Date.now(),
      });
    });

    return new Promise((resolve) => this.#server.listen(this.#port, this.#hostname, () => resolve()));
  }
}
