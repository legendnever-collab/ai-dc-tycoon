// v0.11.1 patch: preset lane-rate fitting and connected / per-λ I/O provisioning.
const assert = require('node:assert/strict'), fs = require('fs');
const m = require('../compiled/chapter7-model'), mss = require('../compiled/chapter7-missions'), sch = require('../compiled/chapter7-schema');
const cases = [];
function test(name, fn) { try { fn(); cases.push({ name, status: 'PASS' }); console.log('PASS ' + name); } catch (e) { cases.push({ name, status: 'FAIL', error: String(e) }); console.error('FAIL ' + name, e); process.exitCode = 1; } }
const apply = (d, patch) => { const x = { ...d, ...patch }; m.validateDesign7(x); return x; };

test('Model ID unchanged so v0.11.0 saves / snapshots remain valid', () => {
  assert.equal(sch.MODEL7, 'optical-architecture-educational-1.0.0');
  assert.equal(sch.RELEASE7, '0.11.1');
});

// Every enabled preset must reproduce the Mission's required Gross exactly.
for (const mission of ['19', '20', '21']) for (const key of Object.keys(mss.PRESETS7)) {
  if (mission === '19' && mss.PRESETS7[key].wavelengths > 1) continue; // WDM presets are disabled in Mission19
  test(`Preset ${key} keeps Mission${mission} target Gross`, () => {
    const d = apply(mss.starter7(mission), mss.presetPatch7(mss.starter7(mission), key)), r = m.solve7(d);
    assert.equal(r.gross, mss.requirement7(d).gross);
    assert.equal(d.connected, d.spatial);
    assert.equal(d.ioChannels, d.spatial * d.wavelengths);
    assert.equal(d.signaling, d.laneRate === 200 ? 'advanced' : 'basic');
    assert.equal(r.constraints.find(c => c.id === 'signaling').pass, true);
  });
}

test('Mission20 Fast preset is 8 × 100G = 800G (was 8 × 50G = 400G)', () => {
  const d = apply(mss.starter7('20'), mss.presetPatch7(mss.starter7('20'), 'fast'));
  assert.deepEqual([d.spatial, d.wavelengths, d.laneRate, d.signaling], [8, 1, 100, 'basic']);
});

test('Mission21 presets are unchanged from v0.11.0', () => {
  for (const key of Object.keys(mss.PRESETS7)) {
    const x = mss.PRESETS7[key], d = apply(mss.starter7('21'), mss.presetPatch7(mss.starter7('21'), key));
    assert.deepEqual([d.spatial, d.wavelengths, d.laneRate, d.mux, d.signaling], [x.spatial, x.wavelengths, x.laneRate, x.mux, x.signaling]);
  }
});

test('Fully connected paths follow Spatial Paths up and down', () => {
  let d = mss.starter7('19');
  d = apply(d, mss.provisionPatch7(d, { spatial: 8 }));
  assert.deepEqual([d.spatial, d.connected, d.ioChannels], [8, 8, 8]);
  d = apply(d, mss.provisionPatch7(d, { spatial: 16 }));
  assert.deepEqual([d.spatial, d.connected, d.ioChannels], [16, 16, 16]);
});

test('Fully provisioned per-λ I/O follows wavelength change', () => {
  let d = mss.starter7('21');
  d = apply(d, mss.provisionPatch7(d, { wavelengths: 4 }));
  assert.equal(d.ioChannels, 64);
  d = apply(d, mss.provisionPatch7(d, { spatial: 4 }));
  assert.deepEqual([d.connected, d.ioChannels], [4, 16]);
});

test('Deliberate under-provisioning is preserved (clamped, not silently repaired)', () => {
  let d = { ...mss.starter7('19'), connected: 10, ioChannels: 12 };
  d = apply(d, mss.provisionPatch7(d, { spatial: 12 }));
  assert.deepEqual([d.connected, d.ioChannels], [10, 12]);
  d = apply(d, mss.provisionPatch7(d, { spatial: 6 }));
  assert.equal(d.connected, 6);
  assert.equal(m.solve7(d).constraints.find(c => c.id === 'connectivity').pass, true);
});

test('Explicit connected / ioChannels in the patch always win', () => {
  const d = mss.starter7('19'), p = mss.provisionPatch7(d, { spatial: 8, connected: 3, ioChannels: 5 });
  assert.deepEqual([p.connected, p.ioChannels], [3, 5]);
});

test('Unrelated edits do not touch provisioning', () => {
  const d = { ...mss.starter7('19'), connected: 10 };
  assert.deepEqual(mss.provisionPatch7(d, { lengthCm: 1 }), { lengthCm: 1 });
});

fs.mkdirSync('evidence/v0111', { recursive: true });
fs.writeFileSync('evidence/v0111/golden.json', JSON.stringify({ executedAt: new Date().toISOString(), model: sch.MODEL7, release: sch.RELEASE7, cases, pass: cases.filter(x => x.status === 'PASS').length, fail: cases.filter(x => x.status === 'FAIL').length }, null, 2));
