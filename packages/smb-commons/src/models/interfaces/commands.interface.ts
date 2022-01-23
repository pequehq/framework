import { ICommandTypes } from './types';

export interface ICommand<TCommand extends ICommandTypes, TAction = string> {
  command: TCommand;
  action: TAction;
  socketId: string;
  issueTimestamp: number;
}

interface IMessageAction {
  topic: string;
  message: string;
}

export type IMessageCommand = ICommand<'message', IMessageAction>;

interface IPublishAction {
  topic: string;
  message: string;
}

export type IPublishCommand = ICommand<'publish', IPublishAction>;

interface ISubscribeAction {
  topic: string;
}

export type ISubscribeCommand = ICommand<'subscribe', ISubscribeAction>;
export type IUnsubscribeCommand = ICommand<'unsubscribe', ISubscribeAction>;

export type IWelcomeCommand = ICommand<'welcome'>;
