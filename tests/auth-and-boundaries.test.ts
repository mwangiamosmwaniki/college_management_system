import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { proxyToBackend, getBackendApiUrl } from '../lib/server/backend-proxy.ts';

describe('Spring Boot Gateway and Backend Proxy Boundary Tests', () => {
  let mockBackendServer: http.Server;
  let backendPort: number;
  let backendBaseUrl: string;

  before(async () => {
    // Create a mock Spring Boot server to test proxy contract
    mockBackendServer = http.createServer((req, res) => {
      const url = req.url || '';
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        // 1. POST /api/v1/auth/login
        if (url.startsWith('/api/v1/auth/login') && req.method === 'POST') {
          try {
            const parsed = JSON.parse(body);
            if (parsed.identifier === 'ADM-001' && parsed.password === 'CorrectPassword123!') {
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': 'SESSION=spring_session_token_xyz123; Path=/; HttpOnly; SameSite=Lax'
              });
              res.end(JSON.stringify({
                success: true,
                message: 'Authentication successful',
                data: {
                  id: 'usr_admin_1',
                  userId: 'usr_admin_1',
                  identifier: 'ADM-001',
                  fullName: 'Dr. Elizabeth Mutua',
                  email: 'e.mutua@apex.edu',
                  roles: ['ADMIN'],
                  portalAssignments: [
                    {
                      portalId: 'ADMIN',
                      roleId: 'ROLE_ADMIN',
                      roleName: 'System Administrator',
                      isAdmin: true,
                      isMonitor: false
                    }
                  ]
                }
              }));
              return;
            }

            // Invalid credentials
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: 'Invalid credentials.'
            }));
            return;
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Malformed JSON' }));
            return;
          }
        }

        // 2. GET /api/v1/auth/me
        if (url.startsWith('/api/v1/auth/me') && req.method === 'GET') {
          const cookieHeader = req.headers['cookie'] || '';
          if (cookieHeader.includes('SESSION=spring_session_token_xyz123')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              data: {
                id: 'usr_admin_1',
                userId: 'usr_admin_1',
                identifier: 'ADM-001',
                fullName: 'Dr. Elizabeth Mutua',
                email: 'e.mutua@apex.edu',
                roles: ['ADMIN'],
                portalAssignments: [
                  {
                    portalId: 'ADMIN',
                    roleId: 'ROLE_ADMIN',
                    roleName: 'System Administrator',
                    isAdmin: true,
                    isMonitor: false
                  }
                ]
              }
            }));
            return;
          }

          // No valid session
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Unauthorized: Session missing or expired'
          }));
          return;
        }

        // 3. POST /api/v1/auth/logout
        if (url.startsWith('/api/v1/auth/logout') && req.method === 'POST') {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': 'SESSION=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
          });
          res.end(JSON.stringify({
            success: true,
            message: 'Logged out successfully',
            data: null
          }));
          return;
        }

        // 4. GET /api/v1/finance/invoices/student/:studentId (IDOR Protected in Spring Boot)
        if (url.startsWith('/api/v1/finance/invoices/student/') && req.method === 'GET') {
          const studentId = url.split('/').pop();
          const cookieHeader = req.headers['cookie'] || '';
          if (cookieHeader.includes('SESSION=student_session')) {
            if (studentId === 'stu_authorized') {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, data: [{ invoiceId: 'INV-100' }] }));
              return;
            } else {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: 'Forbidden: Access denied to requested record.' }));
              return;
            }
          }
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }

        // Default 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Not found' }));
      });
    });

    await new Promise<void>((resolve) => {
      mockBackendServer.listen(0, '127.0.0.1', () => {
        const address = mockBackendServer.address() as { port: number };
        backendPort = address.port;
        backendBaseUrl = `http://127.0.0.1:${backendPort}`;
        process.env.BACKEND_API_URL = backendBaseUrl;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      mockBackendServer.close(() => resolve());
    });
  });

  it('1. Architecture Mandate: lib/server/auth-store.ts is completely eliminated', () => {
    const authStorePath = path.join(process.cwd(), 'lib', 'server', 'auth-store.ts');
    assert.strictEqual(
      fs.existsSync(authStorePath),
      false,
      'auth-store.ts MUST NOT exist in the repository'
    );
  });

  it('2. Authentication with valid credentials proxies to Spring Boot and forwards Set-Cookie', async () => {
    const nextReq = new Request('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'ADM-001',
        password: 'CorrectPassword123!',
        tenantId: 'inst_apex_tvet'
      })
    });

    const res = await proxyToBackend(nextReq, '/api/v1/auth/login');
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.identifier, 'ADM-001');
    assert.ok(data.data.portalAssignments.length > 0);

    // Verify Spring Boot session cookie was preserved
    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie?.includes('SESSION=spring_session_token_xyz123'));
  });

  it('3. Authentication with invalid credentials returns 401 with NO manufactured fallback identity', async () => {
    const nextReq = new Request('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'ADM-001',
        password: 'WrongPassword123!',
        tenantId: 'inst_apex_tvet'
      })
    });

    const res = await proxyToBackend(nextReq, '/api/v1/auth/login');
    assert.strictEqual(res.status, 401);

    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.message, 'Invalid credentials.');
  });

  it('4. Authentication when Spring Boot is offline fails with 502 and NO local fallback', async () => {
    // Temporarily point to a dead port
    process.env.BACKEND_API_URL = 'http://127.0.0.1:59999';

    const nextReq = new Request('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'ADM-001',
        password: 'CorrectPassword123!',
        tenantId: 'inst_apex_tvet'
      })
    });

    const res = await proxyToBackend(nextReq, '/api/v1/auth/login');
    assert.strictEqual(res.status, 502);

    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.message, 'Unable to sign you in right now. Please try again.');

    // Restore valid URL
    process.env.BACKEND_API_URL = backendBaseUrl;
  });

  it('5. GET /api/v1/auth/me forwards session cookie and returns user identity', async () => {
    const nextReq = new Request('http://localhost:3000/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Cookie': 'SESSION=spring_session_token_xyz123'
      }
    });

    const res = await proxyToBackend(nextReq, '/api/v1/auth/me');
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.identifier, 'ADM-001');
  });

  it('6. GET /api/v1/auth/me without session returns 401 (NO fake user / default student)', async () => {
    const nextReq = new Request('http://localhost:3000/api/v1/auth/me', {
      method: 'GET',
      headers: {}
    });

    const res = await proxyToBackend(nextReq, '/api/v1/auth/me');
    assert.strictEqual(res.status, 401);

    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  it('7. IDOR Protection: Student cannot access other student finance records through proxy', async () => {
    // Requesting unauthorized student record with student cookie
    const nextReq = new Request('http://localhost:3000/api/v1/finance/invoices/student/stu_unauthorized', {
      method: 'GET',
      headers: {
        'Cookie': 'SESSION=student_session'
      }
    });

    const res = await proxyToBackend(nextReq, '/api/v1/finance/invoices/student/stu_unauthorized');
    assert.strictEqual(res.status, 403);

    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes('Forbidden'));
  });

  it('8. Logout proxy forwards cookie invalidation', async () => {
    const nextReq = new Request('http://localhost:3000/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Cookie': 'SESSION=spring_session_token_xyz123'
      }
    });

    const res = await proxyToBackend(nextReq, '/api/v1/auth/logout');
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie?.includes('Expires=') || setCookie?.includes('SESSION=;'));
  });
});
