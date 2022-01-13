console.log('Post-build actions:');

const ncp = require('ncp').ncp;
const fs = require('fs');

const copyAssets = () => {
  const assets = [
    {
      source: './src/models/mustache',
      destination: './dist/models/mustache',
    },
  ];

  fs.mkdirSync('./dist/models/mustache', { recursive: true });

  console.log('\nCopying assets...');
  assets.forEach((asset) => {
    ncp(asset.source, asset.destination, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`  - [${asset.source}]: DONE`);
    });
  });
};

// Run
copyAssets();
