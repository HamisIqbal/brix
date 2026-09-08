#!/bin/sh
# Rebuild then restart cleanly. A stale `next start` serving a replaced .next
# produces phantom 400s on hashed CSS and unstyled layout — do not skip the kill.
set -e
npx next build 2>&1 | grep -E "✓ Compiled|✓ Generating|Failed|Error" || true
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3210 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }" 2>/dev/null || true
sleep 2
