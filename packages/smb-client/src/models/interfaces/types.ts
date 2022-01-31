import { ICommand, ICommandTypes } from '@peque/smb-commons';

export type Listener = (command: ICommand<ICommandTypes, unknown>) => void;
