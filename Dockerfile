FROM node:20-alpine AS base

# This Dockerfile is designed for deployment using Turborepo.
# It can build any app in the monorepo by passing the APP_NAME build argument.
# Example: docker build --build-arg APP_NAME=web -t my-web-app .

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
# Set working directory
WORKDIR /app
RUN pnpm install -g turbo@^2

COPY . .

# Prune the workspace for the specific app
ARG APP_NAME
RUN turbo prune ${APP_NAME} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ARG APP_NAME
# Build the specified app
RUN pnpm turbo run build --filter=${APP_NAME}...

FROM base AS runner
WORKDIR /app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/${APP_NAME}/next.config.ts* ./
COPY --from=installer /app/apps/${APP_NAME}/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD node apps/${APP_NAME}/server.js
