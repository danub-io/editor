import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { PUT } from '../route';
import { verifyCloudflareToken } from '@/lib/auth/cloudflare';
import { getDb } from '@gospelreads/db';

vi.mock('@/lib/auth/cloudflare', () => ({
  verifyCloudflareToken: vi.fn(),
}));

vi.mock('@gospelreads/db', () => ({
  getDb: vi.fn(),
  projects: { id: 'id' },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

describe('PUT /api/projects/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 500 when an error occurs', async () => {
    const mockError = new Error('Database connection failed');

    // Mock authentication
    vi.mocked(verifyCloudflareToken).mockResolvedValue({ id: 'user-1' } as any);

    // Mock database to throw error
    vi.mocked(getDb).mockImplementation(() => {
      throw mockError;
    });

    const req = new NextRequest('http://localhost/api/projects/1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'New Title' }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      error: 'Failed to update project',
      details: 'Database connection failed',
    });
  });
});
