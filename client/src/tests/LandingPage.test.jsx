import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

// Mock framer-motion to avoid animations compilation issues in node testing environment
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock TournamentStatusCard component since it ticks intervals and uses animations
jest.mock('../components/TournamentStatusCard', () => {
  return function MockedTournamentStatusCard() {
    return <div data-testid="mock-status-card">Tournament Status Card Mock</div>;
  };
});

describe('Landing Page Component Rendering', () => {
  it('should render the hero section header correctly', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Check if main title is rendered
    const mainHeader = screen.getByRole('heading', { name: /smart stadiums/i });
    expect(mainHeader).toBeInTheDocument();
  });

  it('should render the CTA buttons', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Verify presence of buttons
    const commandCenterBtn = screen.getByRole('link', { name: /command center/i });
    expect(commandCenterBtn).toBeInTheDocument();
  });

  it('should list the core stadium telemetry features', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Verify a feature card heading
    expect(screen.getByText('AI Stadium Assistant')).toBeInTheDocument();
    expect(screen.getByText('Crowd Heatmap Telemetry')).toBeInTheDocument();
  });
});
