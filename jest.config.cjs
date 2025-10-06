module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/bmad-core/runtime/tests/**/*.test.js',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'bmad-core/**/*.js',
    '!bmad-core/**/tests/**',
    '!**/node_modules/**',
  ],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
};
