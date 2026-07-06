const http = require('http');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

let testsPassed = 0;
let testsFailed = 0;
const results = [];

// Helper function to make HTTP requests
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


    if (data) {
      const payload = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(payload);
      const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
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
      req.write(payload);
      req.end();
    } else {
      const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
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
      req.end();
    }

  });
}

// Test logging
function logTest(name, passed, details = '') {
  const icon = passed ? `${colors.green}✅${colors.reset}` : `${colors.red}❌${colors.reset}`;
  console.log(`${icon} ${name}`);
  if (details) console.log(`   ${colors.blue}${details}${colors.reset}`);
  if (passed) testsPassed++;
  else testsFailed++;
  results.push({ name, passed, details });
}

// Main test runner
async function runTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  COMPREHENSIVE SYSTEM TEST SUITE                   ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Wait for server to be ready
  console.log(`${colors.yellow}⏳ Waiting for server to be ready...${colors.reset}`);
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
    console.log(`${colors.red}❌ Server not responding after 5 seconds${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.green}✓ Server is ready!${colors.reset}\n`);

  // ========== DATABASE TESTS ==========
  console.log(`${colors.yellow}TEST GROUP 1: DATABASE CONNECTIVITY${colors.reset}`);
  console.log('─'.repeat(50));

  try {
    const testResult = await makeRequest('GET', '/api/admin/test');
    logTest(
      'Database Connection Test',
      testResult.status === 200,
      `Status: ${testResult.status}, Connected: ${testResult.data?.connected}`
    );
  } catch (e) {
    logTest('Database Connection Test', false, `Error: ${e.message}`);
  }

  // ========== PHOTO MANAGEMENT CRUD TESTS ==========
  console.log(`\n${colors.yellow}TEST GROUP 2: FULL PHOTO CRUD (Create, Read, Update, Delete)${colors.reset}`);
  console.log('─'.repeat(50));

  let testPhotoId = `test-photo-${Date.now()}`;
  let bulkTestId1 = `bulk-test-1-${Date.now()}`;
  let bulkTestId2 = `bulk-test-2-${Date.now()}`;
  let photoCreated = false;

  // CREATE
  const createData = {
    photoId: testPhotoId,
    filename: `test-${Date.now()}.jpg`,
    title: `Integration Test Photo ${Date.now()}`,
    description: 'This is an automated test photo to ensure full CRUD operations work.',
    category: 'automated-test',
    tags: ['test', 'automation'],
    featured: false,
    price: 19.99,
  };

  try {
    const response = await makeRequest('POST', '/api/admin/photos/list', createData);
    photoCreated = response.status === 201;
    logTest(
      'Create New Photo (POST /api/admin/photos/list)',
      photoCreated,
      `Status: ${response.status}, ID: ${response.data?.photoId || 'Unknown'}`
    );

    // Create bulk test photos
    await makeRequest('POST', '/api/admin/photos/list', { ...createData, photoId: bulkTestId1, title: 'Bulk Test 1' });
    await makeRequest('POST', '/api/admin/photos/list', { ...createData, photoId: bulkTestId2, title: 'Bulk Test 2' });
  } catch (e) {
    logTest('Create New Photo', false, `Error: ${e.message}`);
  }

  // READ (List & Single)
  if (photoCreated) {
    try {
      const response = await makeRequest('GET', `/api/admin/photos/${testPhotoId}`);
      logTest(
        `Read Created Photo (GET /api/admin/photos/${testPhotoId})`,
        response.status === 200 && response.data?.photoId === testPhotoId,
        `Title: ${response.data?.title}`
      );
    } catch (e) {
      logTest('Read Created Photo', false, `Error: ${e.message}`);
    }

    // UPDATE
    const updateData = {
      title: `${createData.title} - UPDATED`,
      price: 29.99,
      featured: true
    };

    try {
      const response = await makeRequest('PUT', `/api/admin/photos/${testPhotoId}`, updateData);
      logTest(
        `Update Photo (PUT /api/admin/photos/${testPhotoId})`,
        response.status === 200 && response.data?.title === updateData.title,
        `New title: "${response.data?.title || 'Update failed'}", Status: ${response.status}`
      );
    } catch (e) {
      logTest('Update Photo', false, `Error: ${e.message}`);
    }

    // DELETE SINGLE
    try {
      const response = await makeRequest('DELETE', `/api/admin/photos/${testPhotoId}`);
      logTest(
        `Delete Single Photo (DELETE /api/admin/photos/${testPhotoId})`,
        response.status === 200,
        `Status: ${response.status}`
      );
    } catch (e) {
      logTest('Delete Single Photo', false, `Error: ${e.message}`);
    }

    // BULK DELETE
    try {
      const response = await makeRequest('DELETE', '/api/admin/photos/bulk', { ids: [bulkTestId1, bulkTestId2] });
      logTest(
        'Bulk Delete Photos (DELETE /api/admin/photos/bulk)',
        response.status === 200 && response.data?.count === 2,
        `Deleted ${response.data?.count || 0} photos, Status: ${response.status}`
      );
    } catch (e) {
      logTest('Bulk Delete Photos', false, `Error: ${e.message}`);
    }
  }

  // ========== PUBLIC API TESTS ==========
  console.log(`\n${colors.yellow}TEST GROUP 3: PUBLIC ENDPOINTS & PAGINATION${colors.reset}`);
  console.log('─'.repeat(50));

  try {
    const response = await makeRequest('GET', '/api/photos?page=1&limit=2');
    logTest(
      'Public Photos Pagination (GET /api/photos?page=1&limit=2)',
      response.status === 200 && Array.isArray(response.data) && response.data.length <= 2,
      `Status: ${response.status}, Returned length: ${response.data?.length || 0}`
    );
  } catch (e) {
    logTest('Public Photos Pagination', false, `Error: ${e.message}`);
  }

  // ========== PAGE RENDERING TESTS ==========
  console.log(`\n${colors.yellow}TEST GROUP 4: PAGE RENDERING${colors.reset}`);
  console.log('─'.repeat(50));

  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/gallery', name: 'Gallery' },
    { path: '/admin', name: 'Admin Dashboard' },
    { path: '/admin/photos/manage', name: 'Photo Management' },
    { path: '/checkout', name: 'Checkout Page' },
    { path: '/sitemap.xml', name: 'Dynamic Sitemap' },
  ];

  for (const page of pages) {
    try {
      const response = await makeRequest('GET', page.path);
      const hasContent = response.data && response.data.length > 100;
      logTest(
        `Render ${page.name} (${page.path})`,
        response.status === 200 && hasContent,
        `Status: ${response.status}, Content size: ${response.data?.length || 0} bytes`
      );
    } catch (e) {
      logTest(`Render ${page.name}`, false, `Error: ${e.message}`);
    }
  }

  // ========== SUMMARY ==========
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  TEST SUMMARY                                      ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const total = testsPassed + testsFailed;
  const passRate = ((testsPassed / total) * 100).toFixed(1);

  console.log(`${colors.green}✅ PASSED: ${testsPassed}${colors.reset}`);
  console.log(`${colors.red}❌ FAILED: ${testsFailed}${colors.reset}`);
  console.log(`${colors.cyan}📊 PASS RATE: ${passRate}%${colors.reset}`);

  console.log(`\n${colors.yellow}DETAILED RESULTS:${colors.reset}`);
  console.log('─'.repeat(50));

  results.forEach((r) => {
    const icon = r.passed ? `${colors.green}✅${colors.reset}` : `${colors.red}❌${colors.reset}`;
    console.log(`${icon} ${r.name}`);
    if (r.details) console.log(`   ${r.details}`);
  });

  // Status
  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  if (testsFailed === 0) {
    console.log(`${colors.green}🎉 ALL TESTS PASSED! System is working correctly.${colors.reset}`);
  } else if (passRate >= 80) {
    console.log(`${colors.yellow}⚠️  MOST TESTS PASSED (${passRate}%) - Minor issues detected${colors.reset}`);
  } else {
    console.log(`${colors.red}🚨 SIGNIFICANT FAILURES - Please review errors above${colors.reset}`);
  }
  console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((e) => {
  console.error(`${colors.red}Test runner error: ${e.message}${colors.reset}`);
  process.exit(1);
});
