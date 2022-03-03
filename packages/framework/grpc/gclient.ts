import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const packageDefinition = loadSync('test.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const TestService: any = grpc.loadPackageDefinition(packageDefinition).TestService;

const client = new TestService('localhost:50051', grpc.credentials.createInsecure());

client.getAll({}, (error, news) => {
  if (error) {
    console.error(error);
  }
  console.log(news);
});
