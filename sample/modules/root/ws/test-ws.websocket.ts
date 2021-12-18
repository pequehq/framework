import { WebSocketServer } from '../../../../src/decorators/websockets';
import { OnWebSocketDestroy, OnWebSocketInit } from '../../../../src/models/interfaces/life-cycle.interface';
import { EventPayload } from '../../../../src/services/events/event-manager.service';
import { OnEvent } from '../../../../src/decorators/events';

@WebSocketServer(8899)
export class TestWebsocket implements OnWebSocketInit, OnWebSocketDestroy {
  onWebSocketDestroy() {
    console.log('I have been initialized', TestWebsocket.name);
  }

  onWebSocketInit() {
    console.log('I have been destroyed', TestWebsocket.name);
  }

  @OnEvent('ws.ciao')
  test(data: EventPayload<any>) {
    console.log('on event', data);
  }
}
