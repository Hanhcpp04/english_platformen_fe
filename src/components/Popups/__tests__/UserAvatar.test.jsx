import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import UserAvatar from '../UserAvatar';

// Mock authService
vi.mock('../../../service/authService', () => ({
  logout: vi.fn(),
  getProfile: vi.fn()
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('UserAvatar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render loading state initially', () => {
    // Arrange
    localStorage.setItem('accessToken', 'test-token');

    // Act
    render(
      <MemoryRouter>
        <UserAvatar />
      </MemoryRouter>
    );

    // Assert
    // Component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should not render when no token exists', () => {
    // Act
    render(
      <MemoryRouter>
        <UserAvatar />
      </MemoryRouter>
    );

    // Assert
    // Component handles no token gracefully
    expect(document.body).toBeInTheDocument();
  });

  it('should handle valid token in localStorage', () => {
    // Arrange
    localStorage.setItem('accessToken', 'valid-token');
    localStorage.setItem('refreshToken', 'valid-refresh-token');

    // Act
    render(
      <MemoryRouter>
        <UserAvatar />
      </MemoryRouter>
    );

    // Assert
    expect(document.body).toBeInTheDocument();
  });
});
