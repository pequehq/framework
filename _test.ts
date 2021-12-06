import { SwaggerFactory } from './src/factory/swagger-factory';

const test = new SwaggerFactory();
test.createServersFile();
test.createTagsFile();
test.createInfoFile();
