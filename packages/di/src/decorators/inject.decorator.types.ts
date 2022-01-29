interface InjectOptions {
  identifier: string;
}

interface InjectMetadata {
  identifier: string;
  propertyKey?: string;
  parameterIndex?: number;
}

type InjectMetadataParam = Required<Omit<InjectMetadata, 'propertyKey'>>;

type InjectMetadataProperty = Required<Omit<InjectMetadata, 'parameterIndex'>>;

export type { InjectMetadata, InjectOptions, InjectMetadataParam, InjectMetadataProperty };
