import 'reflect-metadata';

import { NATIVE_SERVICES } from './src/models/constants/native-services';
import { loadInjectables } from './src/utils/dependencies.utils';

export const SERVICES = Object.values(NATIVE_SERVICES);

export const prepare = async () => await loadInjectables();
