import { ServerOptions } from 'socket.io';

export interface WebSocketDefinition {
  port: number;
  options: ServerOptions
}
