import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PurchasePage } from './buy';

describe('PurchasePage', () => {
  it('collects the buyer name and email before checkout', () => {
    render(<PurchasePage />);

    expect(screen.getByRole('heading', { name: /buy metabo/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue to review/i })).toBeInTheDocument();
  });
});
