#!/bin/sh
# Move both submodules to the tip of the branch named in .gitmodules (main),
# rather than to the commit this repo currently records.
#
#   .pikku-core            pikkujs/pikku            — the framework source the docs are checked against
#   .template-online-shop  pikkujs/template-online-shop — the source of every code snippet on the site
#
# `git pull` on its own only ever restores the *recorded* commit, so this is what
# "always on latest" needs. The post-merge hook (npm run install-hooks) runs it
# after every pull; run it by hand any other time with `npm run sync-submodules`.
set -e

cd "$(dirname "$0")/.."

before_core=$(git rev-parse --short HEAD:.pikku-core 2>/dev/null || echo none)
before_tpl=$(git rev-parse --short HEAD:.template-online-shop 2>/dev/null || echo none)

git submodule update --init --remote --recursive

after_core=$(git -C .pikku-core rev-parse --short HEAD 2>/dev/null || echo none)
after_tpl=$(git -C .template-online-shop rev-parse --short HEAD 2>/dev/null || echo none)

printf '[sync-submodules] .pikku-core            %s -> %s\n' "$before_core" "$after_core"
printf '[sync-submodules] .template-online-shop  %s -> %s\n' "$before_tpl" "$after_tpl"

# The template is not just source we read — snippets.json is generated from it and
# committed, so a moved pointer means the committed snippets are behind.
if [ "$before_tpl" != "$after_tpl" ]; then
  printf '[sync-submodules] template moved: run `npm run sync-snippets` and commit both\n'
fi

# surface.json ships inside a *built* @pikku/cli, so a fresh .pikku-core checkout
# does not carry one. Only nudge when a usable source is actually present.
if [ "$before_core" != "$after_core" ] &&
   { [ -f node_modules/@pikku/cli/surface.json ] || [ -f ../pikku/packages/cli/surface.json ]; }; then
  printf '[sync-submodules] core moved: run `npm run sync-api-surface` and commit the result\n'
fi
