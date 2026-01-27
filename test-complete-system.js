const http = require('http');
const fs = require('fs');

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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
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

  // ========== PHOTO LIST TESTS ==========
  console.log(`\n${colors.yellow}TEST GROUP 2: PHOTO RETRIEVAL${colors.reset}`);
  console.log('─'.repeat(50));

  let photoList = [];
  let photoId = null;

  try {
    const response = await makeRequest('GET', '/api/admin/photos/list');
    logTest(
      'Fetch All Photos (GET /api/admin/photos/list)',
      response.status === 200 && Array.isArray(response.data),
      `Status: ${response.status}, Photos: ${response.data?.length || 0}`
    );
    if (response.data && Array.isArray(response.data)) {
      photoList = response.data;
      if (photoList.length > 0) {
        photoId = photoList[0].id;
        console.log(`   ${colors.cyan}Found ${photoList.length} photos in database${colors.reset}`);
        photoList.slice(0, 3).forEach((p) => {
          console.log(`     • ${p.title || p.filename} (ID: ${p.id})`);
        });
      }
    }
  } catch (e) {
    logTest('Fetch All Photos', false, `Error: ${e.message}`);
  }

  // ========== PHOTO DETAIL TESTS ==========
  console.log(`\n${colors.yellow}TEST GROUP 3: PHOTO DETAILS${colors.reset}`);
  console.log('─'.repeat(50));

  if (photoId) {
    try {
      const response = await makeRequest('GET', `/api/admin/photos/${photoId}`);
      logTest(
        `Fetch Single Photo (GET /api/admin/photos/${photoId})`,
        response.status === 200 && response.data?.id,
        `Photo: ${response.data?.title || response.data?.filename}`
      );

      if (response.data) {
        console.log(`   ${colors.cyan}Photo Details:${colors.reset}`);
        console.log(`     • Filename: ${response.data.filename}`);
        console.log(`     • Title: ${response.data.title || 'N/A'}`);
        console.log(`     • Category: ${response.data.category || 'N/A'}`);
        console.log(`     • Featured: ${response.data.featured}`);
        console.log(`     • Processed Size: ${response.data.processedSizeMB || 'N/A'} MB`);
      }
    } catch (e) {
      logTest('Fetch Single Photo', false, `Error: ${e.message}`);
    }
  }

  // ========== PHOTO UPDATE TEST ==========
  console.log(`\n${colors.yellow}TEST GROUP 4: PHOTO MANAGEMENT (UPDATE)${colors.reset}`);
  console.log('─'.repeat(50));

  if (photoId) {
    const updateData = {
      title: `Updated Test Title - ${new Date().getTime()}`,
      description: 'This is a test update',
      category: 'test-update',
      price: 99.99,
    };

    try {
      const response = await makeRequest('PUT', `/api/admin/photos/${photoId}`, updateData);
      logTest(
        `Update Photo (PUT /api/admin/photos/${photoId})`,
        response.status === 200,
        `New title: "${response.data?.title || 'Update failed'}"`
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

  // ========== PUBLIC API TESTS ==========
  console.log(`\n${colors.yellow}TEST GROUP 5: PUBLIC ENDPOINTS${colors.reset}`);
  console.log('─'.repeat(50));

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

  // ========== PAGE RENDERING TESTS ==========
  console.log(`\n${colors.yellow}TEST GROUP 6: PAGE RENDERING${colors.reset}`);
  console.log('─'.repeat(50));

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
