import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProtectedRoute from '../ProtectedRoute';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div>Protected Content</div>;
  const LoginComponent = () => <div>Login Page</div>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render protected content when user has valid tokens', () => {
    // Arrange
    localStorage.setItem('accessToken', 'valid-access-token');
    localStorage.setItem('refreshToken', 'valid-refresh-token');

    // Act
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when no access token', () => {
    // Act
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should redirect to login when token is invalid', () => {
    // Arrange
    localStorage.setItem('accessToken', 'undefined');
    localStorage.setItem('refreshToken', 'valid-refresh-token');

    // Act
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
