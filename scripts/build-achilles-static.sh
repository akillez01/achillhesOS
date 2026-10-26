#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SOURCE_DIR="${SOURCE_DIR:-$REPO_ROOT/apps/portfolio}"
OUTPUT_DIR="${OUTPUT_DIR:-$REPO_ROOT/dist/achilles-public}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Diretório de origem não encontrado: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

rsync -av --delete \
  --exclude '.DS_Store' \
  --exclude 'dist/' \
  --exclude 'out/' \
  --exclude '.vercel/' \
  --exclude '.env*' \
  --exclude '.gitignore' \
  "$SOURCE_DIR/" "$OUTPUT_DIR/"

if [[ ! -f "$OUTPUT_DIR/index.html" ]]; then
  echo "Build inválido: index.html não encontrado em $OUTPUT_DIR" >&2
  exit 1
fi

echo "Build estático concluído em: $OUTPUT_DIR"
