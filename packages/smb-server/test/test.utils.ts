import { DiContainer } from 'peque-di';
import { EventService } from 'peque-smb-commons';

import { MessageCommand, PublishCommand, SubscribeCommand, UnsubscribeCommand, WelcomeCommand } from '../src/commands';
import { SubscribeService } from '../src/services';

export const DI = new DiContainer();

const providers = [
  SubscribeService,
  EventService,
  MessageCommand,
  PublishCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  WelcomeCommand,
];
export const loadProviders = (): void => {
  for (const provider of providers) {
    DI.set(provider, provider.name);
  }
};

async function wait(interval: 'short' | 'medium' | 'long' | number = 'short'): Promise<void> {
  let ms: number;

  if (typeof interval === 'number') {
    ms = interval;
  } else {
    ms = {
      short: 100,
      medium: 1000,
      long: 3000,
    }[interval];
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { wait };
