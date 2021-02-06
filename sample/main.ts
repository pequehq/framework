import 'reflect-metadata';
import { TestRootModule } from './modules/root/test-root.module';
import { ExpressFactory } from '../src/factory/express-factory';

const cors = require('cors');
const bodyParser = require('body-parser');

async function startUp() {
  const expressServer = ExpressFactory.createServer({
      rootModule: TestRootModule,
      globalMiddlewares: {
        preRoutes: [
          bodyParser.urlencoded({extended: true}),
          bodyParser.json({limit: '2m'})
        ],
        postRoutes: [cors]
      },
      isCpuClustered: false
    }
  );
}
startUp();

