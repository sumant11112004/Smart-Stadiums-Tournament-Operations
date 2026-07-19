import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import api from '../services/api';

// Mock api service
jest.mock('../services/api', () => ({
  get: jest.fn(),
  put: jest.fn()
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('Admin Dashboard Component', () => {
  const mockMetrics = {
    users: 42,
    aiQueries: 105,
    activeAlerts: 0,
    feedbacks: 12,
    databaseState: 'online',
    recentQueries: [
      { _id: '1', query: 'Nearest gate?', response: 'Gate A is closest.' }
    ],
    recentFeedback: [
      { _id: '1', subject: 'Lost item', name: 'Bob', email: 'bob@example.com', message: 'I lost my keys.' }
    ]
  };

  const mockZones = [
    { _id: 'z1', zone: 'Gate A', density: 'low', queueTimeMinutes: 5, suggestions: 'Keep Gate A open' }
  ];

  beforeEach(() => {
    api.get.mockImplementation((url) => {
      if (url === '/admin/dashboard') {
        return Promise.resolve({ data: mockMetrics });
      }
      if (url === '/crowd/status') {
        return Promise.resolve({ data: mockZones });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading spinner initially', () => {
    const { container } = render(<Dashboard />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should fetch metrics and render admin operations elements', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Operations Center')).toBeInTheDocument();
      expect(screen.getByText('System Users')).toBeInTheDocument();
      expect(screen.getByText('Total AI Queries')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });
});
