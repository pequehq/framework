import { Container } from '@pequehq/di';

import { ResolverService } from '../src';
import { diHelper } from '../src/helpers';

export const DI = new Container();

export function loadProviders(): void {
  DI.set(ResolverService, ResolverService.name);

  diHelper.register(DI);
}

export function unloadProviders(): void {
  diHelper.get().unsetAll();
}
