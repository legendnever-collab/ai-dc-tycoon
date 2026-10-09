# v0.7.0 CI stabilization

This hotfix changes CI timing and installation budgets only. Runtime source,
numerical fixtures, mission assertions, stored campaign schemas and existing
published release archives remain unchanged. PR #5 is not merged.

## Issue A: legacy result-button lifetime

Run `37954188039`, job `113900372062`, failed in Mission03 at
`#skip-simulation`: the locator was unstable, then detached. The original
simulation calls `finish` automatically after a 3200ms animation. Completion
re-renders `#mission-panel` and removes the button. A slow runner can finish
normally while Playwright is still waiting to click that transient button.

`tests/v04-browser-ci.cjs` adapts exactly two timing fragments of the original
suite in memory. This preserves the immutable `tests/v04-browser.cjs` hash and
all original assertions checked by the v06 source guard. The adapter fails
closed if either original fragment changes. `verify.yml` runs this adapter.

The adapter clicks the real Run button, checks the mission identity and exactly
one attempt increment, and waits for an enabled result button or an actual
terminal state. It uses normal Playwright actionability for the result click.
A TimeoutError is accepted only when this same attempt already has a terminal
result. The exact simulation and evaluation must then equal the pre-run
forecast, and the real result panel must contain the expected clear/fail text.
Other errors, incomplete simulations and incorrect results still fail. No
forced clicks, fabricated clears, numerical substitutions or timeout increases
are used.

Local focused validation used Playwright1.56.1 and Chromium141.0.7390.37,
matching the failing Actions runner: all21 original scenarios passed. Separate
focused checks verified trusted Run/Skip clicks and a result button removed by
natural completion, including exact100XP/120Credits first-clear rewards.
The complete deterministic/browser suites must also pass on the final HEAD.

Issue A commit: `57ee26e0627ba465619803559799b3b18ba427cf`.

After installation succeeded, run `37999272046` exposed the same DOM-lifetime
class of failure in the v07 Navigator: `scrollIntoViewIfNeeded` retained a node
that was replaced after an OE simulation updated campaign progress. The v07
click helper now uses normal `Locator.click` directly. Playwright scrolls,
checks actionability and re-resolves detached nodes within that single action.
No forced click, extra retry, changed assertion or longer test budget is added.
This Browser helper adjustment also leaves the executable unchanged.

## Issue B: cold-runner dependency download

Run `37954188052`, job `113900371718`, expired during Ubuntu APT dependency
installation, before downloading Chromium. The font package download stalled
for more than four minutes; the combined installation had a five-minute cap.
The same pinned installation command succeeded on the other cold runners.

Both workflows retain `playwright@1.56.1` and
`npx playwright install --with-deps chromium`. The installation cap is15 minutes
in every browser job, with no cache, retries or skipped regression groups.
Browser test step budgets are unchanged. Job caps are40 minutes for v07 and35
minutes for the three legacy browser jobs so the larger bounded installation
budget does not consume the existing browser test budget.

## Release provenance

The v07 CI artifact name includes `${{ github.sha }}`. Normal packaging records
that exact source commit and fresh source hashes in its generated manifest.
Packages generated on a runner are new Actions artifacts, not replacements for
the original archives or manifest committed with the release.

Expected unchanged v07 executable SHA-256:
`2b648ab3b32ef05ab0beed7b5e9c2dcdb518c4321ad65fdf7b389f24fdd5d7a8`.

Re-run the legacy suite with `node tests/v04-browser-ci.cjs`, the deterministic
suites from both workflows, and `npm run test:v07-browser`. The authoritative
remote outcome is the two workflow runs for the current PR head, not the
historical474 local checks or successful jobs from older commits.
