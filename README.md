# E-Commerce-System

A lightweight e‑commerce MVP built as a modular Spring Boot monolith with a React frontend. Designed for fast iteration, low operational overhead, and easy local development with Docker Compose.

**Core technologies**
- **Frontend:** React  
- **Backend:** Spring Boot (Java)  
- **Database:** PostgreSQL with JSONB for flexible product attributes  
- **Messaging:** RabbitMQ (optional for async tasks)  
- **Payments:** PayPal Checkout (sandbox for development)  
- **Dev tooling:** Docker, Docker Compose, Flyway, GitHub Actions

---

### Project overview

This repository implements an MVP online store with:
- Product catalog and product pages  
- Cart with guest and authenticated flows using JWT  
- Order model with idempotency support and status lifecycle  
- PayPal Checkout integration using server create/capture flow  
- Local dev stack via Docker Compose including Postgres and RabbitMQ  
- CI pipeline and staging deployment guidance

The architecture favors a single deployable monolith for rapid delivery. Add services such as hosted search, Redis caching, or dedicated workers only when needed.

---

### Quick start

Follow these steps to run the project locally using Docker Compose.

#### Prerequisites
- **Git** installed and configured  
- **Docker** and **Docker Compose** installed  
- **Node.js** and **npm** for frontend development (optional if using Docker)  
- **Java 17+** and **Maven** or **Gradle** if running backend outside Docker

#### Clone repository
```bash
git clone https://github.com/Shaho93/E-Commerce-System.git
cd E-Commerce-System
```

#### Environment variables
Create a `.env` file from `.env.example` and set required values. Example keys to set:

```
POSTGRES_USER=dev
POSTGRES_PASSWORD=devpass
POSTGRES_DB=app_dev
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-paypal-sandbox-secret
JWT_SECRET=change_this_to_a_secure_value
```

**Important** Never commit secrets to the repository.

#### Start services
```bash
docker-compose up --build
```

- Backend: `http://localhost:8080` (health endpoint at `/actuator/health` or `/health`)  
- Frontend: `http://localhost:8082` or served by the frontend container depending on config  
- Postgres and RabbitMQ: ports defined in `docker-compose.yml`

#### Database migrations
Flyway runs automatically on backend startup if configured. To run manually inside the backend container or locally:
```bash
# Maven
./mvnw flyway:migrate

# Gradle
./gradlew flywayMigrate
```

#### Seed data
Initial Flyway migration inserts sample products for local development. Verify with:
```bash
psql -h localhost -U dev -d app_dev -c "SELECT id, sku, name FROM products LIMIT 10;"
```

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

Copy this file into `README.md` at the repository root and update `REPO_NAME`, PayPal credentials, and any environment specifics before sharing.
