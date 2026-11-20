## 4‑Wochen‑Ablauf für das E‑commerce MVP (detailliert)

**Kurzüberblick**  
Dieser Plan liefert einen konkreten, tag‑genauen Ablauf für die nächsten vier Wochen (Woche 1–4). Jede Woche enthält Ziele, konkrete Deliverables, einen Tagesplan (Mo–Fr), Akzeptanzkriterien, Checkpoints und Risiken mit Gegenmaßnahmen. Alle Aufgaben sind standardmäßig auf **@Shaho93** gesetzt.

---

## Woche 1 — Foundations (Repo, Branching, Docker, DB, Migrations)

**Ziele**
- Repository‑Governance, Branching, Templates einrichten  
- Lokale Dev‑Umgebung mit Docker Compose lauffähig machen  
- Erste Flyway‑Migration für Produkte + Seed‑Daten

**Deliverables**
- `CONTRIBUTING.md`, `.github/CODEOWNERS`, Issue/PR‑Templates  
- `docker-compose.yml` mit `backend`, `frontend`, `postgres`, `rabbitmq`  
- Flyway Migration `V1__create_products_table.sql` mit Sample Data

**Tagesplan**
- **Tag 1 (Mo)**: Repo anlegen; `main` und `develop` erstellen; `CONTRIBUTING.md` und `BRANCHING.md` hinzufügen; initialen Commit pushen.  
- **Tag 2 (Di)**: `.github/CODEOWNERS` und Issue/PR‑Templates erstellen; Beispiel‑Issue/PR anlegen; Branch‑Protection für `main` konfigurieren.  
- **Tag 3 (Mi)**: `backend/Dockerfile` und `frontend/Dockerfile` erstellen; Basis `docker-compose.yml` anlegen (Postgres + RabbitMQ).  
- **Tag 4 (Do)**: Backend‑Startupskript (DB‑wait), `.env.example` erstellen; `docker-compose up --build` testen; Health‑Endpoints prüfen.  
- **Tag 5 (Fr)**: Flyway integrieren; `V1__create_products_table.sql` schreiben; Migration lokal ausführen; Sample Data prüfen; Ende‑der‑Woche Demo.

**Akzeptanzkriterien**
- `docker-compose up` startet alle Services; Backend‑Health erreichbar.  
- `products` Tabelle existiert mit Seed‑Daten; Flyway läuft automatisch.  
- CODEOWNERS und Templates sind im Repo und wirken bei neuen PRs/Issues.

**Checkpoints**
- Tägliches kurzes Standup (15 min)  
- Midweek Review (Mi Nachmittag)  
- Demo + Merge der Beispiel‑Feature‑PR (Fr)

**Risiken und Gegenmaßnahmen**
- *Fehlende Secrets* → `.env.example` + sichere Ablage (lokal)  
- *Portkonflikte* → Standardports dokumentieren, Compose‑Ports anpassen  
- *Flyway Fehler* → Migration lokal testen, Rollback‑Notizen erstellen

---

## Woche 2 — Core Commerce (Product APIs, Frontend Listing, Cart)

**Ziele**
- Produkt‑CRUD APIs mit Pagination und Filter  
- React: Produktliste und Produktdetailseite  
- Cart‑Logik (Guest + JWT) implementieren

**Deliverables**
- REST Endpoints: `GET /products`, `GET /products/{id}`, `POST/PUT/DELETE`  
- React Komponenten: `ProductCard`, Listing, Detail, Add to Cart  
- Cart API: `GET/POST/PUT/DELETE /cart/items`; JWT Auth Basis

**Tagesplan**
- **Tag 1 (Mo)**: API‑Design finalisieren; DTOs und Mapping definieren; OpenAPI‑Spec aktualisieren.  
- **Tag 2 (Di)**: Implementiere `GET /products` mit Pagination und Filter; Unit‑Tests schreiben.  
- **Tag 3 (Mi)**: Implementiere `GET /products/{id}` und `POST/PUT/DELETE` mit Validierung; Integrationstests.  
- **Tag 4 (Do)**: Frontend: `ProductCard` und Listing Page; API‑Integration, Loading/Error States.  
- **Tag 5 (Fr)**: Frontend: Product Detail + Add to Cart; End‑to‑End Smoke Test (manuell); Merge PRs.

**Akzeptanzkriterien**
- Produktliste liefert paginierte Ergebnisse und Filter funktionieren.  
- Produktdetail zeigt Bilder, Attribute, Preis; Add to Cart löst korrekte API‑Calls aus.  
- Unit‑ und Integrationstests für Backend vorhanden und grün.

**Checkpoints**
- API Contract Review (Mo Nachmittag)  
- UI Review mit Screenshots (Do)  
- Integration Smoke Test (Fr)

**Risiken und Gegenmaßnahmen**
- *API‑Mismatch Frontend/Backend* → Contract Tests; Mock Server für Frontend‑Entwicklung  
- *Fehlende Bilder/Assets* → Platzhalterbilder verwenden; Asset‑Pipeline dokumentieren  
- *Auth‑Edgecases* → JWT Tests und klare Fehlercodes

---

## Woche 3 — Payments, Search und Async Tasks

**Ziele**
- PayPal Sandbox Integration (create + capture)  
- Basis‑Suche mit Postgres Full‑Text  
- RabbitMQ: Order Events und E‑Mail Consumer (DLQ, Retries)

**Deliverables**
- Endpoints: `POST /payments/paypal/create`, `POST /payments/paypal/capture`  
- `GET /search?q=` mit Ranking; Frontend‑Suchbox + Ergebnisseite  
- RabbitMQ Producer/Consumer für `order.created`; DLQ und Retry‑Policy

**Tagesplan**
- **Tag 1 (Mo)**: PayPal Sandbox Credentials prüfen; Backend SDK konfigurieren; Endpoint‑Skeleton anlegen.  
- **Tag 2 (Di)**: Implementiere `create` Endpoint (server side order creation); Unit‑Tests.  
- **Tag 3 (Mi)**: Implementiere `capture` Endpoint; Update Order Status; Test mit Sandbox (manuell).  
- **Tag 4 (Do)**: Search: Full‑text Index Migration erstellen; `GET /search` implementieren; Frontend Suche integrieren.  
- **Tag 5 (Fr)**: RabbitMQ: Producer in Order Service; Consumer implementieren, E‑Mail via Dev SMTP; DLQ testen.

**Akzeptanzkriterien**
- Sandbox‑Zahlungen können erstellt und erfasst werden; Order erhält Payment Reference.  
- Suche liefert relevante Treffer; Pagination und Filter funktionieren.  
- Consumer ist idempotent; DLQ empfängt fehlerhafte Nachrichten nach Retries.

**Checkpoints**
- PayPal Sandbox Checkout Test (Mi/Do)  
- Search Relevance Check (Do)  
- End‑to‑End Test: Bestellung → Event → E‑Mail (Fr)

**Risiken und Gegenmaßnahmen**
- *Keine PayPal Credentials* → Priorität: Credentials beschaffen; temporär Mock verwenden  
- *Flaky Sandbox* → Automatisierte Tests mit Retries; manuelle Verifikation  
- *Duplicate Emails* → Consumer‑Idempotency und Delivery‑Status speichern

---

## Woche 4 — Hardening, Staging, E2E und Go‑Live Vorbereitung

**Ziele**
- CI Pipeline, Staging Deploy mit Flyway, E2E Tests, Monitoring, Go‑Live Runbook  
- Release‑Readiness und Dry Run auf Staging

**Deliverables**
- GitHub Actions Workflows: Build, Tests, E2E (gegen Staging)  
- Staging Umgebung mit automatischem Flyway‑Deploy  
- E2E Test Suite (Cypress/Playwright) für Checkout Flow  
- Monitoring (Sentry) und Basis‑Metriken (Prometheus)  
- Go‑Live Checkliste und Runbook

**Tagesplan**
- **Tag 1 (Mo)**: CI Workflows anlegen (backend build/test, frontend build/test); Secrets in GitHub setzen.  
- **Tag 2 (Di)**: Staging Provisionieren; Deploy Pipeline konfigurieren; Flyway Migrationslauf testen.  
- **Tag 3 (Mi)**: E2E Tests schreiben: Produktliste → Warenkorb → PayPal Sandbox → Order Confirmation.  
- **Tag 4 (Do)**: Monitoring integrieren (Sentry); Prometheus Metriken exposen; Alerts definieren.  
- **Tag 5 (Fr)**: Dry Run: Deploy auf Staging, E2E ausführen, Smoke Tests, Runbook Durchlauf; Abschlussbericht.

**Akzeptanzkriterien**
- CI läuft auf PRs; `main` ist durch Statuschecks geschützt.  
- Staging deployt erfolgreich; Flyway migrations laufen automatisch.  
- E2E Tests grün gegen Staging; Monitoring erfasst Fehler; Alerts ausgelöst bei Testfehlern.  
- Runbook dokumentiert und Dry Run protokolliert.

**Checkpoints**
- CI Smoke Run (Mo)  
- Staging Deploy Test (Di)  
- E2E Run + Dry Run Review (Fr)

**Risiken und Gegenmaßnahmen**
- *CI Secrets falsch konfiguriert* → Secret‑Checkliste; lokale Testläufe vor Commit  
- *E2E Flakiness* → Stabilisierung: deterministische Selektoren, Testdaten‑Setup, Retries  
- *Monitoring Lücken* → Minimaler Sentry‑Integrationstest vor Go‑Live

---

## Einseitige Kalenderübersicht (Kurz)
- **Woche 1**: M1 — Foundations (Repo, Docker, Flyway)  
- **Woche 2**: M2 — Core Commerce (APIs, Frontend, Cart)  
- **Woche 3**: M3 — Payments & Search (PayPal, Search, RabbitMQ)  
- **Woche 4**: M4 — Hardening & Launch (CI, Staging, E2E, Monitoring)

**Empfohlene Deadlines**  
- Ende Woche 1: M1 abgeschlossen  
- Ende Woche 2: M2 abgeschlossen  
- Ende Woche 3: M3 abgeschlossen  
- Ende Woche 4: M4 abgeschlossen und Dry Run dokumentiert

---

## GitHub Kurz‑Anleitung zur Abbildung
- **Milestones**: Erstelle M1–M4 und weise Issues zu.  
- **Issues**: Kopiere die einzelnen Tasks als Issues mit Labels (`backend`, `frontend`, `infra`, `qa`).  
- **Branches**: `develop` als Integrationsbranch; `feature/<name>` für jede Aufgabe; `hotfix/<name>` für Notfälle.  
- **PR‑Workflow**: Feature → develop; develop → main für Releases; CI + Codeowner Review erforderlich.  
- **Templates**: `.github/ISSUE_TEMPLATE/` und `.github/PULL_REQUEST_TEMPLATE.md` verwenden.

---

## Go‑Live Checkliste (High level)
- **Vor dem Cutover**
  - DNS TTL prüfen und ggf. reduzieren  
  - Backups prüfen und Restore‑Test durchgeführt  
  - Runbook finalisiert und Team informiert
- **Während Cutover**
  - Deploy auf Production durchführen; Flyway Migration überwachen  
  - Smoke Tests ausführen (Health, Produktliste, Checkout Sandbox)  
- **Nach dem Cutover**
  - Monitoring/Alerts beobachten; erste 1–2 Stunden erhöhte Aufmerksamkeit  
  - Rollback‑Plan bereit halten; Kommunikationskanal offen

---
