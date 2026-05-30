#!/usr/bin/env bash
set -euo pipefail

TARGET=${1:-current}

# Install Rust if not present
if ! command -v cargo &>/dev/null; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
  source "$HOME/.cargo/env"
fi

# Install Zola if not present
if ! command -v zola &>/dev/null; then
  cargo install --git https://github.com/getzola/zola.git --tag v0.22.1
fi

# Fetch Notion content
pushd "$(dirname "$0")/fetcher"
if [[ $TARGET = "x86" ]]; then
    echo "building for x86"
    cargo zigbuild --target x86_64-unknown-linux-gnu --release
else
    echo "building for current target"
    cargo run --release
fi
popd

# Build site
zola build
