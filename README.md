# Live020 Authentication API

A serverless authentication API built with TypeScript, AWS Lambda, API Gateway, and Amazon Cognito. The service provisions its own Cognito User Pool and client, exposes the complete email/password authentication flow, and protects profile access with a JWT authorizer.

## Architecture

```text
Client -> API Gateway HTTP API -> Lambda handlers -> Amazon Cognito
                |
                +-> Cognito JWT authorizer -> GET /profile
```

Infrastructure and routes are declared in `serverless.yml`. Lambda handlers live in `src/functions`, shared AWS clients in `src/libs`, and HTTP utilities in `src/utils`. Each function is bundled independently with esbuild for the Node.js 20 ARM64 runtime.

## Features

- Sign-up and email confirmation
- Email/password sign-in
- Access-token renewal with refresh tokens
- Password recovery and reset
- Custom Cognito recovery-email content
- JWT-protected profile retrieval
- Cognito resources managed through CloudFormation

## Prerequisites

- Node.js 20 or newer
- Yarn Classic
- Serverless Framework CLI
- An AWS account with credentials configured for deployment

## Getting Started

Install the project dependencies:

```bash
yarn install --frozen-lockfile
```

Validate the TypeScript source and create the deployment bundle:

```bash
yarn tsc --noEmit --ignoreDeprecations 5.0
yarn eslint "src/**/*.ts"
serverless package
```

Deploy the service to the configured `us-east-1` region:

```bash
serverless deploy
```

The deployment creates the Cognito resources, injects `COGNITO_CLIENT_ID` and `COGNITO_USER_POOL_ID` into the Lambda environment, and prints the HTTP API URL. Use an explicit AWS profile when needed:

```bash
serverless deploy --aws-profile my-profile
```

## API Reference

Replace `<API_URL>` with the URL returned by Serverless.

| Method | Route                        | Authentication      | Request body                                 |
| ------ | ---------------------------- | ------------------- | -------------------------------------------- |
| `POST` | `/auth/sign-up`              | Public              | `email`, `password`, `firstName`, `lastName` |
| `POST` | `/auth/account-confirmation` | Public              | `email`, `code`                              |
| `POST` | `/auth/sign-in`              | Public              | `email`, `password`                          |
| `POST` | `/auth/refresh-token`        | Public              | `refreshToken`                               |
| `POST` | `/auth/forgot-password`      | Public              | `email`                                      |
| `POST` | `/auth/reset-password`       | Public              | `email`, `code`, `newPassword`               |
| `GET`  | `/profile`                   | Bearer access token | None                                         |

### Create and confirm an account

```bash
curl -X POST "<API_URL>/auth/sign-up" \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"password123","firstName":"Dev","lastName":"Example"}'

curl -X POST "<API_URL>/auth/account-confirmation" \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","code":"123456"}'
```

### Sign in and access the profile

Sign-in returns `accessToken` and `refreshToken`. Send the access token to protected routes:

```bash
curl "<API_URL>/profile" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Cognito Configuration

The User Pool uses email as the username and requires `given_name` and `family_name`. Passwords must contain at least 10 characters. Access tokens are valid for 3 hours and refresh tokens for 60 days. Review these security-sensitive settings, IAM permissions, and deletion protection in `serverless.yml` before using the service in production.

## Development Notes

There is currently no automated test suite or package-script layer. The `--ignoreDeprecations 5.0` override is required while the project uses TypeScript 5.3 because `tsconfig.json` currently targets the TypeScript 6.0 deprecation level. Run the type checker, ESLint, and `serverless package` before submitting changes. See [AGENTS.md](./AGENTS.md) for repository conventions and contribution guidance.

## Removing the Stack

To remove the deployed Lambdas, API, and Cognito resources from the active AWS account:

```bash
serverless remove
```

This operation deletes managed cloud resources and should only be run against an intentionally selected stage and AWS profile.
