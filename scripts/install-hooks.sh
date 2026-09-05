#!/bin/sh
# Installs a post-merge hook so `git pull` also moves the submodules to the tip of
# main. Hooks are not tracked by git, so every clone runs this once.
set -e

cd "$(dirname "$0")/.."
hooks=$(git rev-parse --git-path hooks)
mkdir -p "$hooks"

cat > "$hooks/post-merge" <<'HOOK'
#!/bin/sh
# Installed by scripts/install-hooks.sh — keeps .pikku-core and
# .template-online-shop on the tip of main after every pull.
exec sh "$(git rev-parse --show-toplevel)/scripts/sync-submodules.sh"
HOOK

chmod +x "$hooks/post-merge"
echo "[install-hooks] wrote $hooks/post-merge"
