# Repository Guidelines

## Project Structure & Module Organization

This repository is a TypeScript Serverless service backed by Amazon Cognito. Lambda entry points live in `src/functions/`; keep one handler per endpoint or Cognito trigger, such as `signIn.ts` or `cognitoCustomMessage.ts`. Shared AWS clients belong in `src/libs/`, while request parsing and response helpers belong in `src/utils/`. Infrastructure, HTTP routes, IAM permissions, environment variables, and Cognito resources are defined in `serverless.yml`. TypeScript path aliases are configured so `@/utils/response` resolves from `src/`.

## Build, Test, and Development Commands

- `yarn install --frozen-lockfile` installs the exact dependencies recorded in `yarn.lock`.
- `yarn tsc --noEmit` type-checks all files included by `tsconfig.json` without producing `lib/` output.
- `yarn eslint "src/**/*.ts"` runs the configured TypeScript-aware linter over application code.
- `serverless package` bundles each Lambda with esbuild and writes deployment artifacts to `.serverless/`.
- `serverless deploy` deploys the service and Cognito resources to AWS `us-east-1`; use an intentional AWS profile and review infrastructure changes first.

The project currently has no `package.json` scripts, so invoke these tools directly.

## Coding Style & Naming Conventions

Follow the existing TypeScript style: two-space indentation, double quotes, semicolons, trailing commas in multiline structures, and strict types. Use `camelCase` for variables and functions, `PascalCase` for AWS SDK commands/types, and descriptive handler filenames matching their Serverless function keys. Prefer named exports and `import type` for type-only imports. Reuse `bodyParser`, `response`, and the shared `cognitoClient` rather than duplicating plumbing.

## Testing Guidelines

No automated test framework or coverage threshold is configured yet. At minimum, run type checking, ESLint, and `serverless package` before opening a pull request. When adding tests, colocate them as `*.test.ts` near the source or introduce a documented `tests/` directory, add a repeatable `yarn test` script, and mock Cognito calls instead of using live AWS resources.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style subjects, primarily `feat: ...`; use `fix:`, `refactor:`, or `chore:` when appropriate and keep subjects imperative and focused. Pull requests should explain the behavior and infrastructure impact, list verification commands, link relevant issues, and include example request/response payloads for API changes. Highlight changes to IAM, Cognito policies, token lifetimes, or deployment resources explicitly.
