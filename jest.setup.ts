import '@testing-library/jest-dom';

// Global mocks
global.console = {
  ...console,
  // Suppress console.warn and console.error during tests unless debugging
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock useDebounce hook globally
jest.mock('./src/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));