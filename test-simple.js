const http = require('http');

let testsPassed = 0;
let testsFailed = 0;
const results = [];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function logTest(name, passed, details = '') {
  const icon = passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${name}`);
  if (details) console.log(`      ${details}`);
  if (passed) testsPassed++;
  else testsFailed++;
  results.push({ name, passed, details });
}

async function runTests() {
  console.log('\n=== COMPREHENSIVE SYSTEM TEST ===\n');

  // Wait for server
  console.log('Waiting for server...');
  let serverReady = false;
  for (let i = 0; i < 10; i++) {
    try {
      await makeRequest('GET', '/api/admin/test');
      serverReady = true;
      break;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!serverReady) {
    console.log('[FAIL] Server not responding');
    process.exit(1);
  }
  console.log('[PASS] Server is ready\n');

  // TEST GROUP 1: DATABASE CONNECTIVITY
  console.log('--- TEST GROUP 1: DATABASE CONNECTIVITY ---');
  try {
    const testResult = await makeRequest('GET', '/api/admin/test');
    logTest(
      'Database Connection Test',
      testResult.status === 200,
      `Status: ${testResult.status}`
    );
  } catch (e) {
    logTest('Database Connection Test', false, `Error: ${e.message}`);
  }

  // TEST GROUP 2: PHOTO RETRIEVAL
  console.log('\n--- TEST GROUP 2: PHOTO RETRIEVAL ---');
  let photoList = [];
  let photoId = null;

  try {
    const response = await makeRequest('GET', '/api/admin/photos/list');
    const isPassed = response.status === 200 && Array.isArray(response.data);
    logTest(
      'Fetch All Photos (GET /api/admin/photos/list)',
      isPassed,
      `Status: ${response.status}, Photos: ${response.data?.length || 0}`
    );
    if (response.data && Array.isArray(response.data)) {
      photoList = response.data;
      if (photoList.length > 0) {
        photoId = photoList[0].id;
        console.log(`      Found ${photoList.length} photos`);
      }
    }
  } catch (e) {
    logTest('Fetch All Photos', false, `Error: ${e.message}`);
  }

  // TEST GROUP 3: PHOTO DETAILS
  console.log('\n--- TEST GROUP 3: PHOTO DETAILS ---');
  if (photoId) {
    try {
      const response = await makeRequest('GET', `/api/admin/photos/${photoId}`);
      const isPassed = response.status === 200 && response.data?.id;
      logTest(
        `Fetch Single Photo (GET /api/admin/photos/${photoId})`,
        isPassed,
        `Photo: ${response.data?.title || response.data?.filename}`
      );
    } catch (e) {
      logTest('Fetch Single Photo', false, `Error: ${e.message}`);
    }
  }

  // TEST GROUP 4: PHOTO UPDATE
  console.log('\n--- TEST GROUP 4: PHOTO MANAGEMENT (UPDATE) ---');
  if (photoId) {
    const updateData = {
      title: `Test Update ${new Date().getTime()}`,
      description: 'Automated test update',
      category: 'automated-test',
    };

    try {
      const response = await makeRequest('PUT', `/api/admin/photos/${photoId}`, updateData);
      logTest(
        `Update Photo (PUT /api/admin/photos/${photoId})`,
        response.status === 200,
        `Status: ${response.status}`
      );
    } catch (e) {
      logTest('Update Photo', false, `Error: ${e.message}`);
    }

    // Verify update
    try {
      const response = await makeRequest('GET', `/api/admin/photos/${photoId}`);
      const titleMatches = response.data?.title === updateData.title;
      logTest(
        'Verify Update Persisted',
        titleMatches && response.status === 200,
        `Title verified: ${titleMatches}`
      );
    } catch (e) {
      logTest('Verify Update Persisted', false, `Error: ${e.message}`);
    }
  }

  // TEST GROUP 5: PUBLIC API
  console.log('\n--- TEST GROUP 5: PUBLIC ENDPOINTS ---');
  try {
    const response = await makeRequest('GET', '/api/photos');
    logTest(
      'Public Photos Endpoint (GET /api/photos)',
      response.status === 200 && Array.isArray(response.data),
      `Status: ${response.status}, Photos: ${response.data?.length || 0}`
    );
  } catch (e) {
    logTest('Public Photos Endpoint', false, `Error: ${e.message}`);
  }

  // TEST GROUP 6: PAGE RENDERING
  console.log('\n--- TEST GROUP 6: PAGE RENDERING ---');
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/gallery', name: 'Gallery' },
    { path: '/admin', name: 'Admin Dashboard' },
    { path: '/admin/photos/manage', name: 'Photo Management' },
  ];

  for (const page of pages) {
    try {
      const response = await makeRequest('GET', page.path);
      const hasContent = response.data && response.data.length > 100;
      logTest(
        `Render ${page.name}`,
        response.status === 200 && hasContent,
        `Status: ${response.status}, Size: ${response.data?.length || 0} bytes`
      );
    } catch (e) {
      logTest(`Render ${page.name}`, false, `Error: ${e.message}`);
    }
  }

  // SUMMARY
  console.log('\n=== TEST SUMMARY ===\n');
  const total = testsPassed + testsFailed;
  const passRate = ((testsPassed / total) * 100).toFixed(1);

  console.log(`PASSED: ${testsPassed}`);
  console.log(`FAILED: ${testsFailed}`);
  console.log(`PASS RATE: ${passRate}%`);
  console.log(`TOTAL: ${total}\n`);

  if (testsFailed === 0) {
    console.log('✅ ALL TESTS PASSED!\n');
  } else if (passRate >= 80) {
    console.log(`⚠️  MOST TESTS PASSED (${passRate}%)\n`);
  } else {
    console.log(`❌ SIGNIFICANT FAILURES\n`);
  }

  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch((e) => {
  console.error(`Test runner error: ${e.message}`);
  process.exit(1);
});
