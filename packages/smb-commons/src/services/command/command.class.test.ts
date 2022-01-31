import { Injectable } from '@peque/di';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ICommandService } from '../../../dist';
import { DI, loadProviders } from '../../../test/test.utils';
import { Command } from './command.class';
import { CommandEmitter } from './command-emitter.class';
import { CommandError } from './command-error.class';
import { CommandReceiver } from './command-receiver.class';
const test = suite('Command Emitter');
test.before.each((context) => {
  @Injectable()
  class CommandTest implements ICommandService {
    init(): void {
      // noop.
    }
  }

  context.sandbox = sinon.createSandbox();
  context.spies = {
    commandInit: context.sandbox.spy(Command.prototype, 'init'),
    commandErrorInit: context.sandbox.spy(CommandError.prototype, 'init'),
    commandReceiverInit: context.sandbox.spy(CommandReceiver.prototype, 'init'),
    commandEmitterInit: context.sandbox.spy(CommandEmitter.prototype, 'init'),
    commandTestInit: context.sandbox.spy(CommandTest.prototype, 'init'),
  };
  context.comandTest = CommandTest;

  loadProviders();
  DI.set(CommandTest, CommandTest.name);
  DI.set(Command, Command.name);

  context.command = DI.get<Command>('Command');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should initialize command dependencies', (context) => {
  const commandTest = DI.get('CommandTest');
  context.command.init([commandTest]);

  assert.instance(commandTest, context.comandTest);
  assert.ok(context.spies.commandInit.calledWith([commandTest]));
  assert.ok(context.spies.commandErrorInit.calledOnce);
  assert.ok(context.spies.commandReceiverInit.calledOnce);
  assert.ok(context.spies.commandEmitterInit.calledOnce);
  assert.ok(context.spies.commandTestInit.calledOnce);
});

test.run();
