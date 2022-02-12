import { Container } from '@pequehq/di';

import { GraphQL } from './services';
import { ResolverService } from './services/resolver/resolver.service';

export class GraphqlFactory {
  #container = new Container({ providers: [ResolverService, GraphQL] });

  createServer(): GraphQL {
    return this.#container.get<GraphQL>('GraphQL');
  }
}
