/**
 * Resolves the upstream Spring Boot API URL.
 * Defaults to Docker service name 'http://backend:8080'.
 */
export function getBackendApiUrl(): string {
  const envUrl = process.env.BACKEND_API_URL?.trim();
  if (envUrl) {
    // Avoid loopback recursion to Next.js itself if misconfigured to port 3000
    if (envUrl.includes(':3000')) {
      return 'http://backend:8080';
    }
    return envUrl;
  }
  return 'http://backend:8080';
}

const FORWARD_HEADERS = new Set([
  'content-type',
  'accept',
  'cookie',
  'authorization',
  'x-forwarded-for',
  'x-forwarded-proto',
  'x-request-id'
]);

/**
 * Proxies an incoming Next.js request directly to the Spring Boot backend.
 * Spring Boot is the single source of truth for authentication, sessions, and data.
 * No local authentication fallback is performed.
 */
export async function proxyToBackend(
  req: Request,
  targetSubPath: string
): Promise<Response> {
  const backendBase = getBackendApiUrl();
  const url = new URL(req.url);
  const searchParams = url.searchParams.toString();
  const normalizedPath = targetSubPath.startsWith('/') ? targetSubPath : `/${targetSubPath}`;
  const targetUrl = `${backendBase}${normalizedPath}${searchParams ? `?${searchParams}` : ''}`;

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (FORWARD_HEADERS.has(lowerKey)) {
      headers[lowerKey] = value;
    }
  });

  const fetchOptions: RequestInit = {
    method: req.method,
    headers
  };

  if (!['GET', 'HEAD'].includes(req.method)) {
    try {
      const body = await req.text();
      if (body) {
        fetchOptions.body = body;
      }
    } catch {
      // Body may be empty
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    fetchOptions.signal = controller.signal;

    const backendRes = await fetch(targetUrl, fetchOptions);
    clearTimeout(timeoutId);

    const contentType = backendRes.headers.get('content-type') || 'application/json';
    const responseBody = await backendRes.text();

    const responseHeaders = new Headers();
    responseHeaders.set('content-type', contentType);

    // Forward Set-Cookie header(s) from Spring Boot (e.g. SESSION or JSESSIONID)
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      responseHeaders.set('set-cookie', setCookie);
    }

    return new Response(responseBody, {
      status: backendRes.status,
      headers: responseHeaders
    });
  } catch (err: unknown) {
    const isMeEndpoint = normalizedPath.includes('/auth/me');
    const isLoginEndpoint = normalizedPath.includes('/auth/login');

    if (isMeEndpoint) {
      return Response.json(
        {
          success: false,
          message: 'Unauthorized: Session missing or expired'
        },
        { status: 401 }
      );
    }

    if (isLoginEndpoint) {
      return Response.json(
        {
          success: false,
          message: 'Unable to sign you in right now. Please try again.'
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        success: false,
        message: 'Backend service unavailable. Please try again.',
        error: err instanceof Error ? err.message : 'Connection failed'
      },
      { status: 502 }
    );
  }
}
