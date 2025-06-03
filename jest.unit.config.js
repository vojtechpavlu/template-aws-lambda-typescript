export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__unit_tests__/**/*.test.ts'],
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],

  coveragePathIgnorePatterns: [
    // Only testable by integration tests
    '<rootDir>/src/repository/',
    '<rootDir>/src/resolver/',

    // Test mocks
    '<rootDir>/__mock/',
  ],
};
