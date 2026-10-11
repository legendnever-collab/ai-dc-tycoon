// v0.11.1 patch: real UI controls (preset buttons, Spatial / λ inputs) on the offline file:// executable.
const fs = require('fs'), path = require('path'), assert = require('node:assert/strict'), { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const HTML = process.env.AIDCT_HTML || 'ai-dc-tycoon-v0.11.1.html', url = 'file://' + path.resolve(HTML);
const cases = [], errors = [], requests = []; let browser;
const test = async (name, f) => { try { await f(); cases.push({ name, status: 'PASS' }); console.log('PASS ' + name); } catch (e) { cases.push({ name, status: 'FAIL', error: String(e) }); console.error('FAIL ' + name, e); throw e; } };
const ui = p => ({
  preset: k => p.locator(`[data-c7="preset"][data-preset="${k}"]`).click(),
  set: async (k, v) => { const l = p.locator(`[data-c7-input="${k}"]`); if (await l.evaluate(e => e.tagName) === 'SELECT') await l.selectOption(JSON.stringify(v)); else { await l.fill(String(v)); await l.dispatchEvent('change'); } },
  run: async () => { await p.locator('[data-c7="run"]').click(); await p.evaluate(() => window.AIDCT_V11.whenSaved()); },
  cur: id => p.evaluate(id => window.AIDCT_V11.state().practice[id], id),
});
(async () => {
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const cx = await browser.newContext({ viewport: { width: 1440, height: 1000 } }); await cx.setOffline(true);
  const p = await cx.newPage(); p.on('pageerror', e => errors.push(String(e))); p.on('request', r => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
  await p.goto(url); await p.waitForFunction(() => window.AIDCT_V11?.isReady(), null, { timeout: 120000 });
  const u = ui(p);
  await test('Title / home badge / API report v0.11.1', async () => {
    assert.equal(await p.title(), 'AI Data Center Tycoon v0.11.1');
    assert.equal(await p.evaluate(() => window.AIDCT_V11.version), '0.11.1');
    assert.match(await p.locator('#mode-home .eyebrow').first().textContent(), /v0\.11\.1/);
  });
  await test('Mission20 preset buttons always produce 800G Gross', async () => {
    await p.evaluate(() => window.AIDCT_V11.play('20'));
    for (const k of ['wide', 'fast', 'hybrid', 'dense']) {
      await u.preset(k); await u.run(); const s = await u.cur('20');
      assert.equal(s.result.result.gross, 800, k);
      assert.ok(!s.result.result.constraints.some(c => !c.pass && ['gross', 'payload', 'connectivity', 'channels', 'signaling'].includes(c.id)), k);
    }
  });
  await test('Mission19 Fast preset uses Basic signaling at 100G', async () => {
    await p.evaluate(() => window.AIDCT_V11.play('19')); await u.preset('fast'); const d = (await u.cur('19')).design;
    assert.deepEqual([d.spatial, d.laneRate, d.signaling], [8, 100, 'basic']);
  });
  await test('Spatial 16 → 8 → 16 through the input keeps all paths connected', async () => {
    await u.set('spatial', 16); await u.set('spatial', 8); await u.set('spatial', 16); await u.set('laneRate', 50); await u.set('lengthCm', .5); await u.run();
    const s = await u.cur('19');
    assert.deepEqual([s.design.connected, s.design.ioChannels], [16, 16]);
    assert.equal(s.result.result.pass, true);
  });
  await test('Mission21 λ 1 → 4 through the select provisions 64 per-λ I/O channels', async () => {
    await p.evaluate(() => window.AIDCT_V11.play('21')); await u.set('wavelengths', 4); const d = (await u.cur('21')).design;
    assert.equal(d.ioChannels, d.spatial * 4);
  });
  await test('No JS exceptions / No HTTP requests', async () => { assert.deepEqual(errors, []); assert.deepEqual(requests, []); });
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  fs.mkdirSync('evidence/v0111', { recursive: true });
  fs.writeFileSync('evidence/v0111/patch-browser.json', JSON.stringify({ executedAt: new Date().toISOString(), file: HTML, browser: 'Chromium / Playwright', cases, errors, requests, pass: cases.filter(x => x.status === 'PASS').length, fail: cases.filter(x => x.status === 'FAIL').length }, null, 2));
});
