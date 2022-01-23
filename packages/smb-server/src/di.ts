import { DiContainer } from 'peque-di';
import { CommandEmitter, CommandReceiver, EventService } from 'peque-smb-commons/src';
import { Command, CommandParser } from 'ultra-runner/lib/parser';

import { MessageCommand, PublishCommand, SubscribeCommand, WelcomeCommand } from './commands';
import { Broker } from './server/broker.class';

export const DI = new DiContainer();

DI.set(EventService, EventService.name);
DI.set(CommandParser, CommandParser.name);
DI.set(CommandReceiver, CommandReceiver.name);
DI.set(CommandEmitter, CommandEmitter.name);
DI.set(Command, Command.name);
DI.set(WelcomeCommand, WelcomeCommand.name);
DI.set(SubscribeCommand, SubscribeCommand.name);
DI.set(MessageCommand, MessageCommand.name);
DI.set(PublishCommand, PublishCommand.name);
DI.set(Broker, Broker.name);
