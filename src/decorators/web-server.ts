interface WebServerConfig {
  cache: string;
}

export let SERVER_CONFIG;

export const WebServer = (options: WebServerConfig): ClassDecorator => {
  return (target: any) => {
    console.log('server');
    options.cache = options.cache ? `${options.cache}Service` : undefined;
    SERVER_CONFIG = options;
  }
}
