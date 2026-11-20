# E-Commerce-System

A lightweight e‑commerce MVP built as a modular Spring Boot monolith with a React frontend. Designed for fast iteration, low operational overhead, and easy local development with Docker Compose.

**Core technologies**
- **Frontend:** React  
- **Backend:** Spring Boot (Java)  
- **Database:** PostgreSQL with Flyway migrations  
- **Messaging:** RabbitMQ (optional for async tasks)  
- **Payments:** PayPal Checkout (sandbox for development)  
- **Dev tooling:** Docker, Docker Compose, Flyway, GitHub Actions

---

### Status and demo

| | |
| --- | --- |
| **Status** | MVP in development |
| **Live demo** | `https://e-commerce.kindiit.de` (browser demo, see below) |
| **Demo shop** | "Kindi Rösterei", a fictional coffee roastery |

The live demo runs entirely in the browser: the React frontend uses a demo API that mirrors the Spring Boot
backend (same products, pricing rules, stock checks and idempotency) and stores everything in `localStorage`.
No server, no costs, no real orders or payments. With `VITE_API_URL` set, the same frontend talks to the real backend.

### Features

- [x] Product catalog with categories, search and sorting (`GET /api/products`, `GET /api/products/{slug}`, `GET /api/categories`)
- [x] Cart (client side) with free-shipping threshold and stock limits
- [x] Guest checkout (`POST /api/orders`) with server-side pricing, stock reservation and optimistic locking
- [x] Idempotent order creation via `Idempotency-Key` header (no duplicate orders on double click or retry)
- [x] Order lookup by order number (`GET /api/orders/{orderNumber}`)
- [x] Payment abstraction (`PaymentProvider`) with a simulated provider; PayPal Checkout is the next implementation
- [x] Validation and error responses as RFC 9457 Problem Details (German messages)
- [x] Flyway migrations with sample data, integration tests against PostgreSQL, CI with GitHub Actions
- [ ] Customer accounts with JWT login
- [ ] PayPal Checkout (sandbox) with server create/capture
- [ ] Admin area: manage products and order status

### Project structure

```
backend/   Spring Boot 4 (Java 21): catalog, order, payment, common
frontend/  React + TypeScript (Vite): shop, cart, checkout; src/api/demo.ts = browser demo
docker-compose.yml  local stack: backend, frontend, PostgreSQL, RabbitMQ
```

### Quick start

```bash
git clone https://github.com/Shaho93/E-Commerce-System.git
cd E-Commerce-System
cp .env.example .env        # local development values, never commit real secrets
docker compose up --build
```

- Frontend: `http://localhost:8082`
- Backend: `http://localhost:8080/api/products`, health at `/actuator/health`
- Flyway creates the schema and inserts the sample products on startup.

Only the frontend demo (no backend needed):

```bash
cd frontend
npm install
npm run dev                 # without VITE_API_URL the browser demo is used
```

Backend tests need a running PostgreSQL (e.g. `docker compose up postgres`):

```bash
cd backend
./mvnw verify
```

### Demo hosting (Cloudflare, free tier)

Cloudflare Workers project `kindiit-e-commerce`, connected to this repository:

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Production branch | `main` |

---

### Development workflow

**Branch strategy**
- **main** Working live Version — always deployable and protected  
- **develop** Working Version that needs testing — integration branch for completed features  
- **feature/<name>** Finished features that will be merged into develop  
- **hotfix/<name>** Urgent fixes branched from main and merged back into develop

**Pull request rules**
- Open PR from `feature/*` to `develop`  
- Require passing CI and at least one approving review before merge  
- Merge `develop` into `main` for releases after QA and staging verification

**Local testing**
- Backend unit tests:
```bash
./mvnw test
```
- Frontend tests:
```bash
cd frontend
npm install
npm test
```

---

### Contributing and governance

- See **CONTRIBUTING.md** for branch, commit, and PR conventions.  
- Issue and PR templates live under `.github/ISSUE_TEMPLATE` and `.github/PULL_REQUEST_TEMPLATE.md`.  
- `CODEOWNERS` assigns `@Shaho93` as the reviewer for backend, frontend, infra, and docs.

**Quick commands**
```bash
# create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/short-name

# push and open PR
git push -u origin feature/short-name
```

---

### Deployment notes

- Use a staging environment to validate Flyway migrations, E2E tests, and PayPal sandbox flows before production.  
- For production, provision managed services: RDS for Postgres, managed RabbitMQ or CloudAMQP, and a hosted search solution if needed.  
- Enable HTTPS and WAF via Cloudflare or your cloud provider.  
- Consider reserved instances or autoscaling policies to optimize cost as traffic grows.

---

### License

Add a `LICENSE` file at the repository root and specify your chosen license (for example MIT).

---

**Files of interest**
- `README.md` this file  
- `CONTRIBUTING.md` contribution guidelines and branch strategy  
- `.github/CODEOWNERS` reviewer assignments  
- `docker-compose.yml` local dev stack  
- `backend/src/main/resources/db/migration` Flyway migrations

--- 
