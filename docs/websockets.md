---
title: WebSockets
has_children: false
nav_order: 11
---

# WebSockets

The WebSockets are classes decorated with the `@WebSocketServer()` decorator,
and they can implement the lifecycle interfaces `OnWebSocketInit` and `OnWebSocketDestroy`.

The events received from the WebSocket server can be intercepted with the `@ConsumeEvent()` decorator.
Note that all the events routed through the WebSockets have the `ws.` prefix.

Also, the server instantiated by the framework can be injected with the `@GetWebSocketServer()` decorator.

```typescript
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

  @ConsumeEvent('ws.test')
  test(data: EventPayload<any>) {
    console.log('on event', data);
  }
}
```
