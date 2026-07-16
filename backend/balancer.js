// balancer.js
const http = require('http');
const httpProxy = require('http-proxy');

// Create the proxy handler
const proxy = httpProxy.createProxyServer({});

// Configure target worker ports
// Generates an array starting from 5001 up to 5100 (100 ports total)
const WORKER_PORTS = Array.from({ length: 15 }, (_, i) => 5001 + i);
let currentWorkerIndex = 0;

const loadBalancer = http.createServer((req, res) => {
  // Round-Robin selection logic
  const targetPort = WORKER_PORTS[currentWorkerIndex];
  currentWorkerIndex = (currentWorkerIndex + 1) % WORKER_PORTS.length;

  console.log(`[Balancer] Proxying ${req.method} ${req.url} —> http://localhost:${targetPort}`);

  // Forward the request to the selected worker port
  proxy.web(req, res, { target: `http://localhost:${targetPort}` }, (error) => {
    console.error(`[Balancer Error] Instance on port ${targetPort} is unresponsive.`, error.message);
    
    // Fallback if a worker is down
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Bad Gateway", message: `Worker on port ${targetPort} is offline.` }));
  });
});

// Run on the primary port 5000
loadBalancer.listen(5000, () => {
  console.log(`====================================================`);
  console.log(`  Reverse Proxy Load Balancer Active on Port 5000`);
  console.log(`  Distributing traffic to: ${WORKER_PORTS.join(', ')}`);
  console.log(`====================================================\n`);
});