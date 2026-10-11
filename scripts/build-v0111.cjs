// v0.11.1 patch build. Produces ai-dc-tycoon-v0.11.1.html from current src/.
// Every historical executable (v0.3 … v0.11.0) is restored byte-for-byte afterwards,
// so the frozen v0.11.0 release evidence and manifest hashes stay valid.
const fs = require('fs'), cp = require('child_process'), esbuild = require('esbuild');
const VERSION = '0.11.1';
const OUT = 'ai-dc-tycoon-v' + VERSION + '.html';
const frozen = /^ai-dc-tycoon-v0\.(3|4|5|6|7|8|9|10|11)\.html$/;
const historical = new Map(fs.readdirSync('.').filter(p => frozen.test(p)).map(p => [p, fs.readFileSync(p)]));
try {
  // Clean checkouts omit the v0.4–v0.6 fixtures used by regression; the original builders generate them.
  if (['0.4', '0.5', '0.6'].some(v => !fs.existsSync('ai-dc-tycoon-v' + v + '.html')))
    cp.execFileSync(process.execPath, ['build.cjs'], { stdio: 'inherit' });
  cp.execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json'], { stdio: 'inherit' });
  const src = fs.readFileSync('src/chapter7-schema.ts', 'utf8');
  if (!src.includes("RELEASE7='" + VERSION + "'")) throw Error('src/chapter7-schema.ts RELEASE7 must equal ' + VERSION);
  const js = esbuild.buildSync({ entryPoints: ['src/chapter7-entry.ts'], bundle: true, write: false, format: 'iife', target: 'es2020', minify: true, legalComments: 'inline', loader: { '.html': 'text' } }).outputFiles[0].text;
  const css = ['game-style', 'chapter2-style', 'chapter3-style', 'workshop-style', 'campaign-style', 'assembly-style', 'korean-font-v08', 'exploration-style', 'decision-style', 'chapter7-style'].map(n => fs.readFileSync('src/' + n + '.css', 'utf8')).join('\n');
  const shell = fs.readFileSync('src/game-shell-v08.html', 'utf8');
  for (const marker of ['AI Data Center Tycoon v0.8.0', 'v0.8.0 · From Prototype to Production', '/* STYLES */', '/* SCRIPT */'])
    if (!shell.includes(marker)) throw Error('Shell marker missing: ' + marker);
  const html = shell
    .replace('AI Data Center Tycoon v0.8.0', 'AI Data Center Tycoon v' + VERSION)
    .replace('v0.8.0 · From Prototype to Production', 'v' + VERSION + ' · Optical Architecture Challenge')
    .replace('/* STYLES */', () => css)
    .replace('/* SCRIPT */', () => js.replace(/<\/script/gi, '<\\/script'));
  fs.writeFileSync(OUT, html);
  console.log('Built ' + OUT + ' offline: ' + Buffer.byteLength(html) + ' bytes');
} finally {
  for (const [p, bytes] of historical) fs.writeFileSync(p, bytes);
}
