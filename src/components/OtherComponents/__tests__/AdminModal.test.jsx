import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminModal from '../AdminModal';

describe('AdminModal Component', () => {
  const mockOnClose = vi.fn();

  const defaultProps = {
    isOpen: true,
    title: 'Test Modal',
    onClose: mockOnClose,
    children: <div>Modal Content</div>
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal when isOpen is true', () => {
    // Act
    render(<AdminModal {...defaultProps} />);

    // Assert
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    // Act
    render(<AdminModal {...defaultProps} isOpen={false} />);

    // Assert
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    // Act
    render(<AdminModal {...defaultProps} />);
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render different modal sizes', () => {
    // Test small size
    const { rerender } = render(<AdminModal {...defaultProps} size="sm" />);
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    // Test large size
    rerender(<AdminModal {...defaultProps} size="xl" />);
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should display modal title correctly', () => {
    // Act
    render(<AdminModal {...defaultProps} title="Custom Title" />);

    // Assert
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
