import api from '../src/services/api.js';

// stub localStorage
global.localStorage = {
  getItem() { return null; },
  setItem() {},
  removeItem() {}
};

// Mock fetch to return an HTML error page
global.fetch = async () => new Response('<html></html>', {
  status: 500,
  headers: { 'Content-Type': 'text/html' }
});

try {
  await api.request('/non-json');
  console.error('Expected error not thrown');
  process.exit(1);
} catch (err) {
  if (err.message !== 'Request failed') {
    console.error('Unexpected error message:', err.message);
    process.exit(1);
  }
  console.log('HTML response handled correctly');
}

