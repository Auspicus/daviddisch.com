#!/usr/bin/env bash
set -euo pipefail

rm -rf ./out
find ./content/blog -maxdepth 1 -name "*.md" ! -name "_index.md" -delete
rm ./static/img/blog/*.png
rm ./static/img/og/*.png
