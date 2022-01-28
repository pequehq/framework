import { ClassDeclaration, DiContainer } from '@peque/di';

export const loadDI = (DI: DiContainer, providers: ClassDeclaration[]): void => {
  for (const provider of providers) {
    DI.set(provider, provider.name);
  }
};
