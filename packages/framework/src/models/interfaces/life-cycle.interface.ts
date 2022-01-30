import { LifeCycleEventsType } from './types';

export interface OnModuleInit {
  onModuleInit();
}

export interface OnModuleDestroy {
  onModuleDestroy();
}

export interface OnControllerInit {
  onControllerInit();
}

export interface OnControllerDestroy {
  onControllerDestroy();
}

export interface OnWebSocketInit {
  onWebSocketInit();
}

export interface OnWebSocketDestroy {
  onWebSocketDestroy();
}

export interface OnProviderInit {
  onProviderInit();
}

export interface OnProviderDestroy {
  onProviderDestroy();
}

export interface OnServerListen {
  onServerListen();
}

export interface OnServerListenStop {
  onServerListenStop();
}

export interface OnServerStarted {
  onServerStarted();
}

export interface OnServerShutdown {
  onServerShutdown();
}

export interface OnServerBootstrap {
  onServerBootstrap();
}

export interface OnUncaughtException {
  onUncaughtException();
}

export interface OnUncaughtRejection {
  onUncaughtRejection();
}

export interface LifeCycleEvent {
  event: LifeCycleEventsType;
  data?: unknown;
}
