#!/bin/bash

# Script to sync skills from pikku repo to website docs
# Usage: ./sync-skills.sh <skills-source-directory>

set -e

if [ -z "$1" ]; then
  echo "Error: Source skills directory required"
  echo "Usage: ./sync-skills.sh <skills-source-directory>"
  echo "Example: ./sync-skills.sh ../pikku/.claude/skills"
  exit 1
fi

SOURCE_DIR="$1"
DEST_DIR="docs/skills"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory '$SOURCE_DIR' does not exist"
  exit 1
fi

echo "Syncing skills from $SOURCE_DIR to $DEST_DIR..."

# Remove existing skills directory
rm -rf "$DEST_DIR"

# Create fresh skills directory
mkdir -p "$DEST_DIR"

# Copy all skills
cp -r "$SOURCE_DIR"/* "$DEST_DIR/"

# Rename SKILL.md to index.md in each skill directory
cd "$DEST_DIR"
for dir in */; do
  if [ -f "${dir}SKILL.md" ]; then
    echo "Processing ${dir}SKILL.md -> ${dir}index.md"
    mv "${dir}SKILL.md" "${dir}index.md"
  fi
done

echo "Skills synced successfully!"
echo "Note: docs/skills is gitignored and needs to be synced before each build"
