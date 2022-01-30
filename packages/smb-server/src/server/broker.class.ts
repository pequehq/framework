import { Injectable } from '@peque/di';
import { BrokerSocket, Command, EventService, SocketService } from '@peque/smb-commons';
import { randomUUID } from 'crypto';
import { Server } from 'net';

import { MessageCommand, PublishCommand, SubscribeCommand, UnsubscribeCommand, WelcomeCommand } from '../commands';
import { net } from './net';

@Injectable()
export class Broker {
  #server: Server;
  #port = Number(process.env.PORT) || 8021;
  #hostname: string = process.env.HOSTNAME || '127.0.0.1';

  constructor(
    private sockets: SocketService,
    private events: EventService,
    private command: Command,
    private welcomeCommand: WelcomeCommand,
    private subscribeCommand: SubscribeCommand,
    private unsubscribeCommand: UnsubscribeCommand,
    private messageCommand: MessageCommand,
    private publishCommand: PublishCommand,
  ) {
    this.command.init([
      this.welcomeCommand,
      this.unsubscribeCommand,
      this.subscribeCommand,
      this.messageCommand,
      this.publishCommand,
    ]);
  }

  #connectionHandler(socket: BrokerSocket): void {
    socket.id = randomUUID();
    socket.on('data', (data) => this.events.next('incomingCommand', data));
    this.sockets.set(socket);
    this.events.next('welcome', {
      command: 'welcome',
      socketId: socket.id,
      action: {},
      issueTimestamp: Date.now(),
    });
  }

  async create(): Promise<void> {
    this.#server = net.createServer();

    this.events.on('connection', this.#connectionHandler.bind(this));
    this.#server.on('connection', (socket: BrokerSocket) => {
      this.events.next('connection', socket);
    });

    const listener = new Promise<void>((resolve) => {
      this.#server.listen(this.#port, this.#hostname, () => resolve());
    });

    return await listener;
  }
}
