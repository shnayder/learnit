#!/usr/bin/env bash
set -euo pipefail

DENO_VERSION="${DENO_VERSION:-v2.5.3}"
INSTALL_DIR="${INSTALL_DIR:-$PWD/.deno-runtime}"

if command -v deno >/dev/null 2>&1; then
  echo "deno is already installed at $(command -v deno)"
  exit 0
fi

ARCH="x86_64-unknown-linux-gnu"
ARCHIVE_URL="https://github.com/denoland/deno/releases/download/${DENO_VERSION}/deno-${ARCH}.zip"

TMP_DIR=$(mktemp -d)
trap 'rm -rf "${TMP_DIR}"' EXIT

curl -fsSL "${ARCHIVE_URL}" -o "${TMP_DIR}/deno.zip"

mkdir -p "${INSTALL_DIR}/bin"
unzip -oq "${TMP_DIR}/deno.zip" -d "${INSTALL_DIR}/bin"

echo "Deno ${DENO_VERSION} installed to ${INSTALL_DIR}/bin/deno"
echo "Add it to your PATH with:"
echo "  export PATH=\"${INSTALL_DIR}/bin:\$PATH\""
