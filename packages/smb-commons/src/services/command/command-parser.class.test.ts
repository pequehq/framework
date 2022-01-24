import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../../test/utils';
import { CommandInvalidException, CommandParsingException } from '../../models';
import { CommandParser } from './command-parser.class';

const test = suite('Command Parser');

test.before.each((context) => {
  loadProviders();
  context.parser = DI.get<CommandParser>('CommandParser');
  context.correctCommand = {
    command: 'subscribe',
    action: { topic: 'topic' },
    issueTimestamp: 1234567890,
    socketId: 'id_1',
  };
  context.wrongCommand = {
    command: 'subscribe',
  };
});

test.after.each(() => {
  DI.unsetAll();
});

test('should cast a command', (context) => {
  assert.not.throws(() => context.parser.cast(context.correctCommand));
  assert.throws(
    () => context.parser.cast(context.wrongCommand),
    (err) => err instanceof CommandInvalidException,
  );
});

test('should stringify a command', (context) => {
  assert.is(context.parser.stringify(context.correctCommand), JSON.stringify(context.correctCommand));
});

test('should parse a command', (context) => {
  assert.equal(context.parser.parseCommand(JSON.stringify(context.correctCommand)), context.correctCommand);
  assert.throws(
    () => context.parser.parseCommand('{"foo": 1,}'),
    (err) => err instanceof CommandParsingException,
  );
});

test.run();
