import {
  IMessageCommand,
  IPublishCommand,
  ISubscribeCommand,
  IUnsubscribeCommand,
  IWelcomeCommand,
} from './commands.interface';

export type Listener = (...args: any[]) => void;
export type IOutgoingCommandTypes = 'welcome' | 'publish';
export type ICommandTypes = IOutgoingCommandTypes | 'subscribe' | 'unsubscribe' | 'message';
export type ISubjectTypes =
  | 'listening'
  | 'connection'
  | 'error'
  | 'incomingCommand'
  | 'outgoingCommand'
  | ICommandTypes;
export type ICommandDataTypes =
  | ISubscribeCommand
  | IUnsubscribeCommand
  | IPublishCommand
  | IMessageCommand
  | IWelcomeCommand;
