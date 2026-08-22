const http = require('http');

async function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🔒 RUNNING AUTOMATED SECURITY & AUTHENTICATION TESTS...\n');

  // Test 1: Health Check
  const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log('1. Health Check:', health.status === 200 && health.data.success ? '✅ PASS' : '❌ FAIL', health.data);

  // Test 2: Non-Gmail Register
  const nonGmail = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { firstName: 'Test', lastName: 'User', email: 'testuser@yahoo.com', password: 'Password@123' }
  );
  console.log('2. Non-Gmail Reject (yahoo.com):', nonGmail.status === 400 ? '✅ PASS' : '❌ FAIL', nonGmail.data);

  // Test 3: Weak Password Register
  const weakPass = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { firstName: 'Test', lastName: 'User', email: 'testuser.pass@gmail.com', password: 'weakpassword' }
  );
  console.log('3. Weak Password Reject:', weakPass.status === 400 ? '✅ PASS' : '❌ FAIL', weakPass.data);

  // Test 4: Valid Register
  const validReg = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { firstName: 'Test', lastName: 'User', email: `test.gmail.${Date.now()}@gmail.com`, password: 'Strong@Password123' }
  );
  console.log('4. Valid Gmail & Strong Password Register:', validReg.status === 201 ? '✅ PASS' : '❌ FAIL', validReg.data);

  // Test 5: Demo Traveler Login
  const demoLogin = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'demo.traveler@gmail.com', password: 'Demo@1234' }
  );
  console.log('5. Demo User Login:', demoLogin.status === 200 ? '✅ PASS' : '❌ FAIL', demoLogin.data.user ? `Logged in as ${demoLogin.data.user.email} (Role: ${demoLogin.data.user.role})` : demoLogin.data);

  const demoToken = demoLogin.data?.token;

  // Test 6: Admin Access with Regular User Token
  const forbiddenAdmin = await request({
    host: 'localhost', port: 5000, path: '/api/admin/stats', method: 'GET',
    headers: { Authorization: `Bearer ${demoToken}` }
  });
  console.log('6. Regular User Admin Access Blocked:', forbiddenAdmin.status === 403 ? '✅ PASS' : '❌ FAIL', forbiddenAdmin.data);

  // Test 7: Admin Login & Access
  const adminLogin = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'admin.platform@gmail.com', password: 'Admin@1234' }
  );
  const adminToken = adminLogin.data?.token;
  const adminStats = await request({
    host: 'localhost', port: 5000, path: '/api/admin/stats', method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('7. Admin Login & Stats Access:', adminStats.status === 200 ? '✅ PASS' : '❌ FAIL', adminStats.data?.tripStatus);

  // Test 8: Public Trip Sanitization (No private expenses exposed)
  const commTrips = await request({ host: 'localhost', port: 5000, path: '/api/public/trips', method: 'GET' });
  if (commTrips.data && commTrips.data.length > 0 && commTrips.data[0].shareToken) {
    const publicTrip = await request({ host: 'localhost', port: 5000, path: `/api/public/trips/${commTrips.data[0].shareToken}`, method: 'GET' });
    const expensesExposed = publicTrip.data && publicTrip.data.expenses !== undefined;
    console.log('8. Public Trip Sanitization (Expenses Hidden):', !expensesExposed ? '✅ PASS' : '❌ FAIL', 'expenses field:', publicTrip.data?.expenses);
  }

  console.log('\n✨ SECURITY & AUTHENTICATION TEST SUITE COMPLETE');
}

runTests().catch(console.error);
