import 'reflect-metadata';
import { NATIVE_SERVICES } from './src/models/constants/native-services';

export const SERVICES = [];
Object.keys(NATIVE_SERVICES).forEach(value => SERVICES.push(NATIVE_SERVICES[value]));
