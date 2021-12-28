import { Server } from 'socket.io';

import { ConsumeEvent } from '../../../../src/decorators/events';
import { GetWebSocketServer, WebSocketServer } from '../../../../src/decorators/websockets';
import { OnWebSocketDestroy, OnWebSocketInit } from '../../../../src/models/interfaces/life-cycle.interface';
import { EventPayload } from '../../../../src/services/events/event-manager.service';

class Testalo {
  @GetWebSocketServer()
  server: any;
}

@WebSocketServer(8899)
export class TestWebsocket implements OnWebSocketInit, OnWebSocketDestroy {
  @GetWebSocketServer()
  private server: Server;

  onWebSocketDestroy() {
    console.log('I have been destroyed', TestWebsocket.name);
  }

  onWebSocketInit() {
    console.log('I have been initialized', TestWebsocket.name);
    console.log('Socket max listeners', this.server.getMaxListeners());
  }

  @ConsumeEvent('ws.ciao')
  test(data: EventPayload<any>) {
    console.log('on event', data);
  }
}
