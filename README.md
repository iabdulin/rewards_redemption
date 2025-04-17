# Rewards Redemption

https://github.com/iabdulin/rewards_redemption

A full-stack web app built with React, Rails, and PostgreSQL.

[![Lint (Rubocop & TS/ESLint)](https://github.com/iabdulin/rewards_redemption/actions/workflows/lint.yml/badge.svg)](https://github.com/iabdulin/rewards_redemption/actions/workflows/lint.yml)
[![Rails Tests](https://github.com/iabdulin/rewards_redemption/actions/workflows/rails.yml/badge.svg)](https://github.com/iabdulin/rewards_redemption/actions/workflows/rails.yml)
[![Playwright E2E Tests](https://github.com/iabdulin/rewards_redemption/actions/workflows/e2e.yml/badge.svg)](https://github.com/iabdulin/rewards_redemption/actions/workflows/e2e.yml)

<img width="1210" alt="image" src="https://github.com/user-attachments/assets/86ed001c-9897-4970-ad9b-28c59b200c3e" />


More demos:
- https://drive.google.com/file/d/1rBoUpMToUmiM_Ztn0bLvSeQKy-crPud8/view
- https://drive.google.com/file/d/1rCONeYfVQ0-qSeEu9dfKO0bOExLhQfLD/view?usp=sharing

## Setup

#### Backend & Database

1. You need to have Docker installed.
2. Clone the repository.
3. Run `docker-compose build` to build the containers.
4. Run `docker-compose up -d` to start the services.
5. Run `docker-compose exec backend rails db:create` & `docker-compose exec -e RAILS_ENV=test backend rails db:create` to create the databases.
6. Run `docker-compose exec backend rails db:migrate` to migrate the database.
7. Backend is available at: `http://localhost:3000/`
8. Database is available at: `postgres:password@localhost:5432/rr_development`

#### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Frontend is available at: `http://127.0.0.1:5173/`

## Testing the app

- Backend tests (Minitest): `docker-compose exec backend rails test`
- End-to-End tests with Playwright headless in the docker container: `npm run test:e2e`
- E2E tests in headed mode locally: `cd frontend && npx playwright test --headed`
- Alternative way to run E2E tests: Use VSCode Playwright extension.
- Fixtures can be loaded with `docker compose exec backend rails db:fixtures:load`

### E2E Tests

- I chose Playwright because I prefer using it even during the development process instead of a browser to get the application to the state I want.
- The main functionality is tested.
- Special cases for behind-the-scenes updates are tested (see `frontend/tests/e2e/tests/errors.spec.ts`):
  ---- `user.points_balance` became insufficient
  ---- `reward.available` was changed
  ---- `reward` was deleted

### Linting

- Backend (Rubocop): `docker-compose exec backend rubocop`
- Frontend (TS & ESLint) in frontend directory: `npm run lint`

### GitHub Actions

Can be improved by adding more caching to docker layers to speed up builds. Test coverage reports are not generated.

- [![Lint (Rubocop & TS/ESLint)](https://github.com/iabdulin/rewards_redemption/actions/workflows/lint.yml/badge.svg)](https://github.com/iabdulin/rewards_redemption/actions/workflows/lint.yml)
- [![Rails Tests](https://github.com/iabdulin/rewards_redemption/actions/workflows/rails.yml/badge.svg)](https://github.com/iabdulin/rewards_redemption/actions/workflows/rails.yml)
- [![Playwright E2E Tests](https://github.com/iabdulin/rewards_redemption/actions/workflows/e2e.yml/badge.svg)](https://github.com/iabdulin/rewards_redemption/actions/workflows/e2e.yml)

## Assumptions and Simplifications

- All requests in non-production environments are slowed down with 100ms delay to simulate loading (see `ApplicationController#simulate_slow_response` before_action).
- Proper authentication is not implemented in this project for simplicity. The very first user will be used as `current_user` for all API requests (see `ApplicationController#authenticate_user!` before_action).
- CORS is enabled for all origins (should be changed in production)
- Pagination is not implemented for simplicity.
- TestController is used for e2e tests to simulate different scenarios. It is mounted in non-production environments only (see `routes.rb`). It also has a before_action check `ensure_non_production_environment`.

## Architecture

### Backend

- Rails API was initalized with `rails new backend --api --database=postgresql`
- API is scoped to /api/v1 in config/routes.rb. Could be namespaced to Api::V1 module instead but not done for simplicity.
- `Redemptions::CreateService` is a service object that encapsulates the logic for creating a redemption.
- Redeeming rewards locks both `@reward` and `@user` to prevent race conditions (updating reward availability/cost and user points balance).
- `user.points_balance` is a non-negative integer, it's a check constraint in the database.

### Frontend

- Frontend is a React application with a single page.
- ARIA attributes are added to improve accessibility (not mentioned in the requirements but I wanted to learn and practice)

### Active Record Encryption

- SurveyResponses has feeling and comments fields encrypted with default Rails encryption
- .env file is required to be in the root directory (check setup instructions above)
- NOTE: can't query encrypted fields with non-deterministic encryption (default)

## Deployment Strategy

1. Frontend can be built with (`npm run build`) and deployed as a static site
2. Backend can be deployed to a server or cloud service
3. Database deployment: use a managed PostgreSQL service
4. CI/CD workflow: Set up automated testing and deployment using GitHub Actions (3 checks are done in `.github/workflows`)

## Tests Outputs

```bash
~/Sites/test/rewards_redemption main -> dce backend rails test
Running 34 tests in a single process (parallelization threshold is 50)
Run options: --seed 14947

# Running:

..................................

Finished in 0.666721s, 50.9959 runs/s, 152.9876 assertions/s.
34 runs, 102 assertions, 0 failures, 0 errors, 0 skips
```

```bash
~/Sites/test/rewards_redemption/frontend main -> npx playwright test

Running 39 tests using 1 worker

  ✓  1 [chromium] › tests/blank_state.spec.ts:12:3 › Fixtures › user is not logged in (no user present) (605ms)
  ✓  2 [chromium] › tests/blank_state.spec.ts:17:3 › Fixtures › empty database but user is logged in (772ms)
  ✓  3 [chromium] › tests/errors.spec.ts:20:3 › Errors › should show error when user has insufficient balance (1.7s)
  ✓  4 [chromium] › tests/errors.spec.ts:51:3 › Errors › should show error when trying to redeem unavailable reward (2.2s)
  ✓  5 [chromium] › tests/errors.spec.ts:76:3 › Errors › should show error when reward is not found (1.8s)
  ✓  6 [chromium] › tests/errors.spec.ts:97:3 › Errors › should show error for unexpected server error (1.1s)
  ✓  7 [chromium] › tests/fixtures.spec.ts:13:3 › Fixtures › validate all available rewards fixtures are loaded (754ms)
  ✓  8 [chromium] › tests/redemptions.spec.ts:17:3 › Redemption › normal reward redemption (2.3s)
  ✓  9 [chromium] › tests/redemptions.spec.ts:44:3 › Redemption › free reward redemption (1.1s)
  ✓  10 [chromium] › tests/redemptions.spec.ts:56:3 › Redemption › negative reward redemption (earning points) (1.6s)
  ✓  11 [chromium] › tests/rewards.spec.ts:15:3 › Rewards › all available rewards are visible (699ms)
  ✓  12 [chromium] › tests/rewards.spec.ts:21:3 › Rewards › normal reward is enabled (694ms)
  ✓  13 [chromium] › tests/rewards.spec.ts:34:3 › Rewards › expensive reward is disabled (670ms)
  ✓  14 [Mobile Chrome] › tests/blank_state.spec.ts:12:3 › Fixtures › user is not logged in (no user present) (310ms)
  ✓  15 [Mobile Chrome] › tests/blank_state.spec.ts:17:3 › Fixtures › empty database but user is logged in (1.4s)
  ✓  16 [Mobile Chrome] › tests/errors.spec.ts:20:3 › Errors › should show error when user has insufficient balance (1.8s)
  ✓  17 [Mobile Chrome] › tests/errors.spec.ts:51:3 › Errors › should show error when trying to redeem unavailable reward (1.2s)
  ✓  18 [Mobile Chrome] › tests/errors.spec.ts:76:3 › Errors › should show error when reward is not found (1.2s)
  ✓  19 [Mobile Chrome] › tests/errors.spec.ts:97:3 › Errors › should show error for unexpected server error (870ms)
  ✓  20 [Mobile Chrome] › tests/fixtures.spec.ts:13:3 › Fixtures › validate all available rewards fixtures are loaded (674ms)
  ✓  21 [Mobile Chrome] › tests/redemptions.spec.ts:17:3 › Redemption › normal reward redemption (2.3s)
  ✓  22 [Mobile Chrome] › tests/redemptions.spec.ts:44:3 › Redemption › free reward redemption (1.6s)
  ✓  23 [Mobile Chrome] › tests/redemptions.spec.ts:56:3 › Redemption › negative reward redemption (earning points) (1.6s)
  ✓  24 [Mobile Chrome] › tests/rewards.spec.ts:15:3 › Rewards › all available rewards are visible (679ms)
  ✓  25 [Mobile Chrome] › tests/rewards.spec.ts:21:3 › Rewards › normal reward is enabled (687ms)
  ✓  26 [Mobile Chrome] › tests/rewards.spec.ts:34:3 › Rewards › expensive reward is disabled (662ms)
  ✓  27 [Mobile Safari] › tests/blank_state.spec.ts:12:3 › Fixtures › user is not logged in (no user present) (944ms)
  ✓  28 [Mobile Safari] › tests/blank_state.spec.ts:17:3 › Fixtures › empty database but user is logged in (1.4s)
  ✓  29 [Mobile Safari] › tests/errors.spec.ts:20:3 › Errors › should show error when user has insufficient balance (2.3s)
  ✓  30 [Mobile Safari] › tests/errors.spec.ts:51:3 › Errors › should show error when trying to redeem unavailable reward (1.8s)
  ✓  31 [Mobile Safari] › tests/errors.spec.ts:76:3 › Errors › should show error when reward is not found (1.9s)
  ✓  32 [Mobile Safari] › tests/errors.spec.ts:97:3 › Errors › should show error for unexpected server error (1.1s)
  ✓  33 [Mobile Safari] › tests/fixtures.spec.ts:13:3 › Fixtures › validate all available rewards fixtures are loaded (1.3s)
  ✓  34 [Mobile Safari] › tests/redemptions.spec.ts:17:3 › Redemption › normal reward redemption (3.0s)
  ✓  35 [Mobile Safari] › tests/redemptions.spec.ts:44:3 › Redemption › free reward redemption (1.2s)
  ✓  36 [Mobile Safari] › tests/redemptions.spec.ts:56:3 › Redemption › negative reward redemption (earning points) (1.7s)
  ✓  37 [Mobile Safari] › tests/rewards.spec.ts:15:3 › Rewards › all available rewards are visible (734ms)
  ✓  38 [Mobile Safari] › tests/rewards.spec.ts:21:3 › Rewards › normal reward is enabled (852ms)
  ✓  39 [Mobile Safari] › tests/rewards.spec.ts:34:3 › Rewards › expensive reward is disabled (881ms)

  39 passed (52.1s)
```
