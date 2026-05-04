# CI/CD Setup

## Workflows

- `CI` (`.github/workflows/ci.yml`)
  - Trigger: pull request and push to `main`
  - Steps: install dependencies, run unit tests (`pnpm test:ci`), run production build (`pnpm build`)

- `Deploy Production` (`.github/workflows/deploy.yml`)
  - Trigger: push to `main` and manual dispatch
  - Steps: pull Vercel project config, build with Vercel CLI, deploy prebuilt artifact to production

## Required GitHub Secrets

Set these repository secrets before enabling production deploy:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Local commands

- Run tests with coverage:
  - `pnpm test:ci`
- Run tests in watch mode:
  - `pnpm test`
- Run production build:
  - `pnpm build`
