/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@patient-health/types$': '<rootDir>/../../packages/types/src/api.ts',
    '^@patient-health/events$': '<rootDir>/../../packages/events/src/index.ts',
  },
  clearMocks: true,
}
