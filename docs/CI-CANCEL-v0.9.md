# Free Exploration cancellation stability

PR run [38035746085](https://github.com/legendnever-collab/ai-dc-tycoon/actions/runs/38035746085) failed the actual 5,000-sample cancellation scenario. Playwright resolved the Cancel button, observed an unstable position, and then observed its removal when the simulation finished. Earlier local and push runs had passed this timing-sensitive scenario; the failing PR run was not treated as a pass.

The idle screen now reserves the Cancel button in a disabled state, enables it while running, and places changing progress text on its own row. Starting a run no longer inserts an extra flex item or changes the action row's wrapping. Cancellation still uses the unchanged chunked Solver and retains the last valid Practice state.

The browser regression uses real, unforced Run and Cancel clicks at 1440px, 390px, and 320px. It checks the Cancel button's position before and after starting, waits for the button to return to its disabled state, and compares the entire Practice state with the pre-run state. It does not mock completion, dispatch synthetic DOM events, or relax numerical objectives.

The original Campaign runtime and v0.8 executable remain byte exact. Fresh release evidence and archives are generated only after the updated suite passes.

A second PR run (38037114620) passed the position assertion but still finished the calculation before the browser delivered Cancel. The Free Exploration browser adapter now uses the existing Solver yield hook to paint a frame and process input between chunks. A 100ms fallback keeps hidden or stalled frame contexts progressing. Solver equations, draws, seeds, and result ordering are unchanged. A numerical regression checks that yielding produces the exact synchronous seeded result and cancellation leaves the original session untouched. A separate Browser Focus workflow provides quick real Chromium feedback; the full release and Campaign regressions still run unchanged.
