import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '@auth/(.*)': ['<root>/src/features/auth/$1'],
    '@user/(.*)': ['<root>/src/features/user/$1'],
    '@global/(.*)': ['<root>/src/shared/globals/$1'],
    '@service/(.*)': ['<root>/src/shared/services/$1'],
    '@socket/(.*)': ['<root>/src/shared/sockets/$1'],
    '@worker/(.*)': ['<root>/src/shared/workers/$1'],
    '@root/(.*)': ['<root>/src/$1']
  }
};

export default config;
