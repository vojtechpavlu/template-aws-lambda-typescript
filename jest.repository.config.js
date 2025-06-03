export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__repository_tests__/**/*.test.ts'],
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: ['<rootDir>/src/repository/**/*.ts'],
};
