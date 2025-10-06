#!/usr/bin/env bash
set -euo pipefail

sudo_cmd() {
  if command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    "$@"
  fi
}

sudo_cmd apt-get update
sudo_cmd apt-get install -y \
  libatk1.0-0t64 \
  libatk-bridge2.0-0t64 \
  libcups2t64 \
  libxkbcommon0 \
  libatspi2.0-0t64 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2t64 \
  libdrm2 \
  libdrm-intel1 \
  libdrm-amdgpu1 \
  libxcb-dri3-0 \
  libxcb-present0 \
  libxcb-sync1 \
  libxcb-xfixes0 \
  libxshmfence1 \
  libxi6 \
  libxtst6
