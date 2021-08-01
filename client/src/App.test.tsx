import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders BTC profitability', () => {
  render(<App />);
  const linkElement = screen.getByText(/Crypto profitability/i);
  expect(linkElement).toBeInTheDocument();
});
