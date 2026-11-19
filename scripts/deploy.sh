#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -f ".env.local" ]; then
  set -a
  source ".env.local"
  set +a
fi

DEPLOY_HOST="${DEPLOY_HOST:?Please set DEPLOY_HOST}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/wuji-blog}"

echo "==> Building production bundle..."
npm run build

ARCHIVE="/tmp/wuji-blog-dist.tar.gz"
tar -czf "$ARCHIVE" -C dist .

echo "==> Uploading dist to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}..."
if [ -n "${DEPLOY_PASS:-}" ]; then
  export DEPLOY_HOST DEPLOY_PORT DEPLOY_USER DEPLOY_PASS DEPLOY_DIR ARCHIVE
  expect <<'EOF'
set timeout 120
set host $env(DEPLOY_HOST)
set port $env(DEPLOY_PORT)
set user $env(DEPLOY_USER)
set pass $env(DEPLOY_PASS)
set archive $env(ARCHIVE)

spawn scp -o StrictHostKeyChecking=no -P $port $archive ${user}@${host}:/tmp/wuji-blog-dist.tar.gz
expect {
  "assword:" { send "$pass\r"; exp_continue }
  eof
}
EOF
  expect <<'EOF'
set timeout 120
set host $env(DEPLOY_HOST)
set port $env(DEPLOY_PORT)
set user $env(DEPLOY_USER)
set pass $env(DEPLOY_PASS)
set dir $env(DEPLOY_DIR)

spawn ssh -o StrictHostKeyChecking=no -p $port ${user}@${host} "mkdir -p ${dir} && rm -rf ${dir}/* && tar -xzf /tmp/wuji-blog-dist.tar.gz -C ${dir} && rm -f /tmp/wuji-blog-dist.tar.gz && systemctl reload nginx || nginx -s reload"
expect {
  "assword:" { send "$pass\r"; exp_continue }
  eof
}
EOF
else
  scp -o StrictHostKeyChecking=no -P "$DEPLOY_PORT" "$ARCHIVE" "${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/wuji-blog-dist.tar.gz"
  ssh -o StrictHostKeyChecking=no -p "$DEPLOY_PORT" "${DEPLOY_USER}@${DEPLOY_HOST}" \
    "mkdir -p ${DEPLOY_DIR} && rm -rf ${DEPLOY_DIR}/* && tar -xzf /tmp/wuji-blog-dist.tar.gz -C ${DEPLOY_DIR} && rm -f /tmp/wuji-blog-dist.tar.gz && (systemctl reload nginx || nginx -s reload)"
fi

rm -f "$ARCHIVE"
echo "==> Deploy complete: http://${DEPLOY_HOST}"
