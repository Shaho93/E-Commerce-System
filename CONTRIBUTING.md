# CONTRIBUTING

Thank you for contributing. This document explains how to work with the repository, branch and commit conventions, pull request expectations, testing and CI, and how to get help.

---

### Branching and workflow
- **Branches**
  - **main** — Working live Version. Always deployable; protected; only merge from `develop` or `hotfix/*` via PRs.
  - **develop** — Working Version that needs testing. Integration branch for completed features; merged into `main` when ready for release.
  - **feature/<short-name>** — Finished features that will be merged into `develop`. Short‑lived and descriptive (e.g., `feature/cart-checkout`).
  - **hotfix/<short-name>** — Urgent fixes branched from `main`; merge back into `main` and `develop` after release.
- **Workflow**
  1. Branch from `develop`: `git checkout develop && git pull origin develop && git checkout -b feature/<short-name>`.
  2. Work locally with frequent commits.
  3. Rebase or merge from `develop` regularly to avoid drift.
  4. Push and open a PR to `develop`: `git push -u origin feature/<short-name>`.
  5. After review and passing CI, merge into `develop`. Delete the feature branch.
  6. Promote `develop` → `main` via PR when QA/staging is green.

---

### Commit messages and branch naming
- **Branch names**
  - `feature/<short-kebab>` (e.g., `feature/product-import`)
  - `bugfix/<short-kebab>`
  - `hotfix/<short-kebab>`
- **Commit message format (recommended)**
  - **Header:** `type(scope): short summary`  
    - `type` examples: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
    - `scope` optional (e.g., `cart`, `api`).
  - **Body:** one or two lines explaining *why* the change was made.
  - **Example:**
    ```
    feat(cart): add coupon code support

    Store coupon code on order and apply discount during checkout.
    ```
- **Best practices**
  - Keep commits small and focused.
  - Use present tense and imperative mood in headers.
  - Reference issue numbers when applicable: `feat(cart): add coupon code (#42)`.

---

### Pull requests and code review
- **PR targets**
  - Feature branches → `develop`
  - `develop` → `main` for releases
  - Hotfix branches → `main` (and then merge into `develop`)
- **PR checklist (required)**
  - [ ] Title follows conventional format (e.g., `feat(cart): ...`).
  - [ ] Linked issue(s) included in the description.
  - [ ] Summary of changes and rationale provided.
  - [ ] Testing steps and expected results included.
  - [ ] All unit and integration tests pass locally.
  - [ ] CI checks pass on the PR.
  - [ ] At least one approving review from the relevant code owner.
  - [ ] No secrets or credentials committed.
- **Merge policy**
  - Require passing CI and at least one approving review before merge.
  - Use **squash merge** for feature branches to keep history concise (unless otherwise agreed).
  - Delete feature branch after merge.

---

### Testing, CI, and quality gates
- **Local testing**
  - Run unit tests and linters before opening a PR.
  - Use the provided `docker-compose` for local parity with services (Postgres, RabbitMQ).
- **CI**
  - GitHub Actions runs on PRs: build, unit tests, frontend tests, and integration checks.
  - PRs must pass CI before merging.
- **Quality**
  - Add unit tests for new logic and integration tests for cross-service flows.
  - Keep flaky tests below 5%; mark unstable tests and address them promptly.

---

### Coding standards, security, and documentation
- **Coding standards**
  - Follow language idioms and project style guides (e.g., Java formatting, React best practices).
  - Add Javadoc/JS Doc or inline comments for non‑obvious logic.
- **Security**
  - Never commit secrets, API keys, or credentials. Use environment variables and secret stores.
  - Validate and sanitize inputs on server side; follow secure defaults.
  - Report security issues privately to the repository owners rather than opening public issues.
- **Documentation**
  - Update `README.md`, API OpenAPI spec, and any relevant docs when adding features or changing behavior.
  - Add migration notes for DB changes and update Flyway migrations.

---

### Issues, labels, and communication
- **Creating issues**
  - Use clear titles and a concise description of the problem or feature.
  - Include reproduction steps, expected vs actual behavior, and environment details.
- **Labels**
  - Use existing labels (`backend`, `frontend`, `infra`, `qa`, `docs`, `security`, `integration`) to categorize work.
- **Milestones**
  - Assign issues to milestones (M1–M4) to track sprint progress.
- **Contact**
  - Assign an owner for each issue or PR. Use code owners for automatic reviewer assignment via `CODEOWNERS`.

---

### Quick commands cheat sheet
```bash
# create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/cart-checkout

# push and open PR
git push -u origin feature/cart-checkout

# update branch with latest develop
git fetch origin
git checkout feature/cart-checkout
git rebase origin/develop   # or git merge origin/develop

# delete remote branch after merge
git push origin --delete feature/cart-checkout
```

---

### Final notes
- Add a `BRANCHING.md` or link to this file in the repo root for quick reference.
- Use `CODEOWNERS` to ensure the right reviewers are automatically requested.
- Keep contributions small and iterative to speed review and reduce risk.

Thank you for contributing — your work helps us move faster and build a better product.
