export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__resolver_tests__/**/*.test.ts'],
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: ['<rootDir>/src/resolver/**/*.ts'],
};
