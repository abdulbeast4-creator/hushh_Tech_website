import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConsentCard } from './ConsentCard';
import type { ConsentLog } from './ConsentCard';

const grantedLog: ConsentLog = {
  id: '1',
  timestamp: '2026-05-10T00:00:00.000Z',
  action: 'Read Access',
  purpose: 'Analytics',
  status: 'granted',
};

const revokedLog: ConsentLog = {
  id: '2',
  timestamp: '2026-05-10T01:00:00.000Z',
  action: 'Third-party Sharing',
  purpose: 'Marketing',
  status: 'revoked',
};

describe('ConsentCard', () => {
  it('renders the action and purpose', () => {
    render(<ConsentCard log={grantedLog} />);
    expect(screen.getByText('Read Access')).toBeDefined();
    expect(screen.getByText('Analytics')).toBeDefined();
  });

  it('shows Granted badge for granted status', () => {
    render(<ConsentCard log={grantedLog} />);
    expect(screen.getByText('Granted')).toBeDefined();
  });

  it('shows Revoked badge for revoked status', () => {
    render(<ConsentCard log={revokedLog} />);
    expect(screen.getByText('Revoked')).toBeDefined();
  });

  it('has accessible article label for granted event', () => {
    render(<ConsentCard log={grantedLog} />);
    expect(
      screen.getByRole('article', { name: 'Read Access — Granted' })
    ).toBeDefined();
  });

  it('has accessible article label for revoked event', () => {
    render(<ConsentCard log={revokedLog} />);
    expect(
      screen.getByRole('article', { name: 'Third-party Sharing — Revoked' })
    ).toBeDefined();
  });

  it('renders timestamp as a time element', () => {
    render(<ConsentCard log={grantedLog} />);
    const timeEl = document.querySelector('time');
    expect(timeEl).not.toBeNull();
    expect(timeEl?.getAttribute('dateTime')).toBe('2026-05-10T00:00:00.000Z');
  });
});
