console.log('Post-build actions:');

const ncp = require('ncp').ncp;
const fs = require('fs');

fs.mkdirSync('./dist/src/models/mustache', { recursive: true });

const assets = [
    {
        source: './src/models/mustache',
        destination: './dist/src/models/mustache'
    }
];

console.log('\n  Copying assets...');
assets.forEach(asset => {
    ncp(asset.source, asset.destination, err => {
        if (err) {
            return console.error(err);
        }
        console.log(`    - [${asset.source}]: DONE`);
    });
});
