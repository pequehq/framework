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

export interface OnServerShutdown {
  onServerShutdown();
}
