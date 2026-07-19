import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock useAuth hook
jest.mock('../hooks/useAuth', () => () => ({
  user: { name: 'FIFA Fan', email: 'fan@fifa.com', role: 'user' },
  logout: jest.fn(),
  isAuthenticated: true,
  isAdmin: false
}));

describe('Navbar Component', () => {
  it('should render the brand header logo correctly', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('FIFA2026')).toBeInTheDocument();
    expect(screen.getByText('STADIUM')).toBeInTheDocument();
  });

  it('should list all main navigation link pathways', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Green Deck')).toBeInTheDocument();
  });

  it('should toggle mobile menu when clicking hamburger icon', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const menuBtn = screen.getByRole('button', { name: /open main menu/i });
    expect(menuBtn).toBeInTheDocument();
    
    // Initial state: mobile menu is closed (no mobile links visible in typical responsive rendering)
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
