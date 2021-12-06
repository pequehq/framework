import 'reflect-metadata';
import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import { generateParameters } from './scripts/parameters.script';
import { generateComponents } from './scripts/components.script';
import { generateRequestBodies } from './scripts/request-bodies.script';
import { generateControllers } from './scripts/controllers.script';
import { generateSecuritySchemas } from './scripts/security-schemas-script';

generateComponents();
generateRequestBodies();
generateParameters();
generateSecuritySchemas();
generateControllers();

console.log('\nCompleted.');
