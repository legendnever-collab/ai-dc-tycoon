// v0.11.0 is a frozen release: its executable, evidence and RELEASE-MANIFEST-v0.11.json describe
// source commit 003adc6 (rebuild it from ai-dc-tycoon-v0.11-source.zip). Rebuilding it from the
// current src/ would silently put v0.11.1 code under a v0.11.0 title, so this entry point now builds
// the current patch release (ai-dc-tycoon-v0.11.1.html) and restores every historical executable.
require('./build-v0111.cjs');
