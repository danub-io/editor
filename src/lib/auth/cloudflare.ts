import { jwtVerify, createRemoteJWKSet } from 'jose';
import { NextRequest } from 'next/server';

const CLOUDFLARE_TEAM_DOMAIN = process.env.CLOUDFLARE_TEAM_DOMAIN || 'https://example.cloudflareaccess.com';
const CLOUDFLARE_AUDIENCE = process.env.CLOUDFLARE_AUDIENCE || '';

const JWKS = CLOUDFLARE_TEAM_DOMAIN ? createRemoteJWKSet(
  new URL(`${CLOUDFLARE_TEAM_DOMAIN}/cdn-cgi/access/certs`)
) : null;

export async function verifyCloudflareToken(req: NextRequest): Promise<{ email?: string; id?: string } | null> {
  const token = req.headers.get('Cf-Access-Jwt-Assertion') || req.cookies.get('CF_Authorization')?.value;

  if (!token || !JWKS) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      audience: CLOUDFLARE_AUDIENCE,
      issuer: CLOUDFLARE_TEAM_DOMAIN,
    });

    return {
      email: payload.email as string,
      id: payload.sub as string,
    };
  } catch (err) {
    console.error('Invalid Cloudflare JWT', err);
    return null;
  }
}
