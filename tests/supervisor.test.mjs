import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { WorkerSupervisor } from '../dist/supervisor.js';

const worker = new WorkerSupervisor(fileURLToPath(new URL('./fake-worker.cjs', import.meta.url)));
try {
  await worker.call('setQueued', 1);
  await assert.rejects(worker.restart(), /queued or running/);
  await worker.call('setQueued', 0);
  const active = worker.call('hold');
  await assert.rejects(worker.restart(), /requests are in progress/);
  await active;
  const restarted = await worker.restart();
  assert.equal(restarted.restarted, true);
  assert.equal((await worker.call('ping')).ok, true);
  console.log('PASS: queued jobs and active requests block restart; worker responds after restart');
} finally {
  await worker.close();
}
