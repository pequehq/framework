import { Server } from 'socket.io';

import {
  ConsumeEvent,
  EventPayload,
  GetWebSocketServer,
  OnWebSocketDestroy,
  OnWebSocketInit,
  WebSocketServer,
} from '../../../../dist';

@WebSocketServer(8899)
export class TestWebsocket implements OnWebSocketInit, OnWebSocketDestroy {
  @GetWebSocketServer()
  private server: Server;

  onWebSocketDestroy(): void {
    console.log('I have been destroyed', TestWebsocket.name);
  }

  onWebSocketInit(): void {
    console.log('I have been initialized', TestWebsocket.name);
    console.log('Socket max listeners', this.server.getMaxListeners());
  }

  @ConsumeEvent('ws.ciao')
  test(data: EventPayload<any>) {
    console.log('on event', data);
  }
}
