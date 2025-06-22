import { spawn } from 'child_process';
import http from 'http';
import assert from 'assert';

const server = spawn('node', ['server.js']);

const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(2000);

http.get('http://localhost:3000/api/menus/nonexistent', res => {
  assert.strictEqual(res.statusCode, 404);
  server.kill();
  console.log('Test passed');
});
