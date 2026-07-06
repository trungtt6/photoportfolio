import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    expect(screen.getByText('Trungtt Photography')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });
});
