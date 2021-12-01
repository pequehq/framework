module.exports = {
  roots: [
    './'
  ],
  testMatch: [
    './test/**/*.+(ts)',
    '**/?(*.)+(spec|test).+(ts)'
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  setupFiles: ['./jest.setup.ts']
}
