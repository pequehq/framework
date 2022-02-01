import { ControllerDefinition, ModuleDefinition } from '@pequehq/framework';
import * as path from 'path';

export interface GeneralMetadata<TData> {
  data: TData;
  imports: string[];
}

export interface RenderMetadata {
  className: string;
  data?: unknown;
}

type SchemeType = 'module' | 'controller' | 'service' | 'guard' | 'interceptor' | 'transformer';
export const Schemes: Record<SchemeType, unknown> = {
  module: (): GeneralMetadata<ModuleDefinition> => {
    return {
      data: {
        modules: [],
        controllers: [],
        interceptors: [],
        providers: [],
        webSockets: [],
      },
      imports: [],
    };
  },
  controller: (): GeneralMetadata<ControllerDefinition> => {
    return {
      data: {
        prefix: '',
        interceptors: [],
        guards: [],
        middlewares: [],
      },
      imports: [],
    };
  },
  service: (): GeneralMetadata<unknown> => {
    return {
      data: {},
      imports: [],
    };
  },
  guard: (): GeneralMetadata<unknown> => {
    return {
      data: {},
      imports: [],
    };
  },
  interceptor: (): GeneralMetadata<unknown> => {
    return {
      data: {},
      imports: [],
    };
  },
  transformer: (): GeneralMetadata<unknown> => {
    return {
      data: {},
      imports: [],
    };
  },
};

export const Templates: Record<SchemeType, string> = {
  module: path.join(__dirname, './mustache/module.mustache'),
  controller: path.join(__dirname, './mustache/controller.mustache'),
  service: path.join(__dirname, './mustache/service.mustache'),
  guard: path.join(__dirname, './mustache/guard.mustache'),
  interceptor: path.join(__dirname, './mustache/interceptor.mustache'),
  transformer: path.join(__dirname, './mustache/transformer.mustache'),
};

type MetadataFunction = (fileName: string, metadata: GeneralMetadata<any>) => RenderMetadata;

export const Metadata: Record<SchemeType, MetadataFunction> = {
  module: (fileName, metadata: GeneralMetadata<ModuleDefinition>) => {
    const decorators: { name: string; value: string }[] = [];
    Object.keys(metadata.data).forEach((meta) => {
      const value =
        metadata.data[meta].length === 1 ? `[${metadata.data[meta][0].name}]` : JSON.stringify(metadata.data[meta]);
      decorators.push({ name: meta, value });
    });
    return {
      className: fileName,
      data: {
        decorators,
        imports: metadata.imports,
      },
    };
  },
  controller: (fileName) => {
    return {
      className: fileName,
    };
  },
  service: (fileName) => {
    return {
      className: fileName,
    };
  },
  guard: (fileName) => {
    return {
      className: fileName,
    };
  },
  interceptor: (fileName) => {
    return {
      className: fileName,
    };
  },
  transformer: (fileName) => {
    return {
      className: fileName,
    };
  },
};
