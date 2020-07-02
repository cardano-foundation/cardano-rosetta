module.exports = {
  roots: ['<rootDir>/test'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
