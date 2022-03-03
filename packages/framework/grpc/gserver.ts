import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const packageDefinition = loadSync('test.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const testProto: any = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const test = ['simone', 'mitelli', 'tupone'];

server.addService(testProto.TestService.service, {
  getAll: (_, callback) => {
    callback(null, { test });
  },
});

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
  console.log('Server running at http://127.0.0.1:50051');
  server.start();
});
