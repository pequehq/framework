import { DiContainer } from 'peque-di';
import { CommandEmitter, CommandReceiver, EventService } from 'peque-smb-commons/src';
import { Command, CommandParser } from 'ultra-runner/lib/parser';

import { Broker } from './server/broker.class';
import { SubscribeCommand } from './commands';

export const DI = new DiContainer();

DI.set(EventService, EventService.name);
DI.set(CommandParser, CommandParser.name);
DI.set(CommandReceiver, CommandReceiver.name);
DI.set(CommandEmitter, CommandEmitter.name);
DI.set(Command, Command.name);
DI.set(SubscribeCommand, SubscribeCommand.name);
DI.set(Broker, Broker.name);
