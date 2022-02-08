import { Container } from '@pequehq/di';

import { TypeMetadataHelper } from './helpers';
import { SchemaBuilderService } from './services';

export const DI = new Container({ providers: [TypeMetadataHelper, SchemaBuilderService] });
