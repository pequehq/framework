import 'reflect-metadata';
import { NATIVE_SERVICES } from './src/models/constants/native-services';
import { loadInjectables } from './src/utils/dependencies.utils';

export const SERVICES = [];
Object.keys(NATIVE_SERVICES).forEach(value => SERVICES.push(NATIVE_SERVICES[value]));

export const prepare = async () => await loadInjectables();
