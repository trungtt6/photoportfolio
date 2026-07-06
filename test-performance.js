const autocannon = require('autocannon');

async function runPerformanceTest() {
  console.log('Starting Performance Test for Public API /api/photos...');

  const result = await autocannon({
    url: 'http://localhost:3000/api/photos',
    connections: 10, // Number of concurrent connections
    pipelining: 1, // Number of pipelined requests per connection
    duration: 10, // Duration in seconds
  });

  console.log('Performance Test Results:');
  console.log(`- Total Requests: ${result.requests.total}`);
  console.log(`- Req/sec (avg): ${result.requests.average}`);
  console.log(`- Latency (avg): ${result.latency.average} ms`);
  console.log(`- Latency (p99): ${result.latency.p99} ms`);
  console.log(`- Throughput (avg): ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/sec`);

  if (result.errors > 0 || result.non2xx > 0) {
    console.error(`- Errors: ${result.errors}`);
    console.error(`- Non 2xx Responses: ${result.non2xx}`);
  } else {
    console.log('- 100% Success Rate (No errors or non-2xx responses)');
  }
}

runPerformanceTest().catch((err) => {
  console.error('Error running performance test:', err);
});
