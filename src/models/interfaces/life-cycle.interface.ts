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
