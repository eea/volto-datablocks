# syntax=docker/dockerfile:1
ARG VOLTO_VERSION=19
FROM plone/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH
ARG CHROMIUM_VERSION=149.0.7827.196-1~deb12u1

ENV HOST="0.0.0.0"
ENV ADDON_NAME=${ADDON_NAME}
ENV CHROME_BIN="/usr/bin/chromium"
ENV CHROMIUM_BIN="/usr/bin/chromium"
ENV CYPRESS_BROWSER_PATH="/usr/bin/chromium"
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER root
RUN apt-get update -q \
    && apt-get install -qy --no-install-recommends xvfb \
    && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    mkdir -p /etc/apt/sources.list.d /etc/apt/preferences.d /etc/apt/apt.conf.d; \
    printf '%s\n' \
      'Acquire::Check-Valid-Until "false";' \
      > /etc/apt/apt.conf.d/99snapshot-no-check-valid-until; \
    printf '%s\n' \
      'deb [check-valid-until=no] http://snapshot.debian.org/archive/debian-security/20260630T000000Z bookworm-security main' \
      'deb [check-valid-until=no] http://snapshot.debian.org/archive/debian/20260630T000000Z bookworm main' \
      > /etc/apt/sources.list.d/bookworm-chromium149-snapshot.list; \
    apt-get update -q; \
    apt-get install -qy --no-install-recommends \
      "chromium=${CHROMIUM_VERSION}" \
      "chromium-common=${CHROMIUM_VERSION}"; \
    apt-mark hold chromium chromium-common; \
    rm -rf /var/lib/apt/lists/*

USER node

COPY --chown=node:node ./package.json /app/packages/${ADDON_PATH}/package.json
RUN --mount=type=cache,id=pnpm,target=/app/.pnpm-store,uid=1000 \
    set -- \
      "${ADDON_NAME}@workspace:*" \
      "@eeacms/volto-embed" \
      "@eeacms/volto-matomo" \
      "@eeacms/volto-listing-block"; \
    for dependency in \
      "components:@plone/components" \
      "volto-razzle:@plone/razzle" \
      "volto-slate:@plone/volto-slate"; do \
      package_dir="${dependency%%:*}"; \
      package_name="${dependency#*:}"; \
      if [ -f "/app/core/packages/${package_dir}/package.json" ]; then \
        set -- "$@" "${package_name}@workspace:*"; \
      fi; \
    done; \
    if [ ! -f /app/core/packages/volto-razzle/package.json ]; then \
      razzle_version="$(node -p "require('/app/core/packages/volto/package.json').devDependencies.razzle")"; \
      set -- "$@" "razzle@${razzle_version}"; \
    fi; \
    pnpm --config.auto-install-peers=false add --workspace-root --lockfile-only "$@"; \
    pnpm --config.auto-install-peers=false install --force --no-frozen-lockfile
RUN if [ -f /app/core/packages/registry/package.json ]; then pnpm --filter @plone/registry build; fi
RUN pnpm --dir /app --filter "${ADDON_NAME}" exec cypress install

COPY --chown=node:node ./ /app/packages/${ADDON_PATH}/
COPY --chown=node:node ./volto.config.js /app/volto.config.js

ENTRYPOINT ["pnpm"]
CMD ["start"]
