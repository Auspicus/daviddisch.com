#!/usr/bin/env bash
set -euo pipefail

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
cargo run --release
popd

# Build site
zola build
