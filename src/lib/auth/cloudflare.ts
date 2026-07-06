import { jwtVerify, createRemoteJWKSet } from 'jose';
import { NextRequest } from 'next/server';

const CLOUDFLARE_TEAM_DOMAIN = process.env.CLOUDFLARE_TEAM_DOMAIN || '';
const CLOUDFLARE_AUDIENCE = process.env.CLOUDFLARE_AUDIENCE || '';

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJWKS() {
  if (!JWKS) {
    let domain = CLOUDFLARE_TEAM_DOMAIN;
    if (domain && !domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = 'https://' + domain;
    }
    if (!domain) domain = 'https://example.cloudflareaccess.com'; // fallback for build

    try {
      JWKS = createRemoteJWKSet(new URL(`${domain}/cdn-cgi/access/certs`));
    } catch (e) {
      console.warn("Invalid CLOUDFLARE_TEAM_DOMAIN, unable to initialize JWKS.", e);
      return null;
    }
  }
  return JWKS;
}

export async function verifyCloudflareToken(req: NextRequest): Promise<{ email?: string; id?: string } | null> {
  const token = req.headers.get('Cf-Access-Jwt-Assertion') || req.cookies.get('CF_Authorization')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJWKS()!, {
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
