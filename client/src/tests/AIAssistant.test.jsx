import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIAssistant from '../pages/AIAssistant';
import api from '../services/api';

// Mock api
jest.mock('../services/api', () => ({
  post: jest.fn(),
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('AI Stadium Assistant Component', () => {
  beforeEach(() => {
    api.post.mockClear();
  });

  it('should render welcoming bot message initially', () => {
    render(<AIAssistant />);
    expect(screen.getByText(/FIFA 2026 Smart Stadium Assistant/i)).toBeInTheDocument();
  });

  it('should send a query and append bot response to chat on submit', async () => {
    const mockResponse = { data: { response: 'The closest gate to Section 112 is Gate C.' } };
    api.post.mockResolvedValue(mockResponse);

    render(<AIAssistant />);

    const textInput = screen.getByPlaceholderText(/Ask about parking/i);
    const sendBtn = screen.getByRole('button', { name: /send message/i });

    // Type a query
    fireEvent.change(textInput, { target: { value: 'Closest gate to section 112' } });
    fireEvent.click(sendBtn);

    // Verify user message is appended
    expect(screen.getByText('Closest gate to section 112')).toBeInTheDocument();

    // Wait for mock bot response to be rendered
    await waitFor(() => {
      expect(screen.getByText('The closest gate to Section 112 is Gate C.')).toBeInTheDocument();
    });
  });
});
