[English](#induo-house) · [Polski](#induo-house-pl)
 
---

# Induo House

[![CI](https://github.com/kbetkowsky/induo-house/actions/workflows/ci.yml/badge.svg)](https://github.com/kbetkowsky/induo-house/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Full-stack real estate listing platform. Users can register, post property listings with photos, and browse or filter offers by city, type, and price range.

The backend is built with Java 21 and Spring Boot, backed by PostgreSQL with Flyway handling schema migrations. Authentication uses JWT tokens stored in httpOnly cookies. The frontend is a Next.js 16 app in TypeScript using TanStack Query for server state, React Hook Form with Zod for validation, and Leaflet for an interactive map.

On every push to `main`, GitHub Actions runs 49 tests (unit + integration via Testcontainers), then builds Docker images, pushes them to Amazon ECR, and restarts the containers on EC2 over SSH.

## Stack

**Backend** — Java 21, Spring Boot, PostgreSQL, Spring Data JPA, Flyway, Spring Security, JWT, Testcontainers, Maven

**Frontend** — Next.js 16, React 19, TypeScript, Tailwind CSS v4, TanStack Query, React Hook Form, Zod, Leaflet

**Infrastructure** — Docker, Docker Compose, GitHub Actions, AWS EC2, Amazon ECR

## Getting started

Requirements: Java 21+, Node.js 18+, Docker

**Backend**

```bash
cp .env.example .env
cd induo-house
./mvnw spring-boot:run
```

Swagger UI available at `http://localhost:8080/swagger-ui/index.html`

**Frontend**

```bash
cd induo-house-frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

## AI chat

The project now includes a persistent AI chat module with session history.

To enable it locally:

```bash
cp .env.example .env
docker compose up -d postgres ollama
docker exec induo-ollama ollama pull llama3.1:8b
```

Then set in `.env`:

```env
APP_AI_ENABLED=true
AI_CHAT_MODEL=llama3.1:8b
OLLAMA_BASE_URL=http://localhost:11434
```

Optional RAG setup:

```env
APP_AI_RAG_ENABLED=true
AI_EMBEDDING_MODEL=nomic-embed-text
```

Frontend chat is available for authenticated users at `/chat`.

## Environment variables

Copy `.env.example` to `.env`:

```
DB_PASSWORD=your_database_password
JWT_SECRET=your_random_secret_at_least_32_characters_long
JWT_COOKIE_SECURE=false
JWT_COOKIE_SAME_SITE=Lax
```

Never commit `.env` — it is in `.gitignore`.

`JWT_SECRET` can be a plain-text secret or a Base64-encoded value, but it must be at least 32 bytes long after decoding. For local development on `http://localhost`, keep `JWT_COOKIE_SECURE=false`. For HTTPS deployments, set it to `true`.

AI variables:

```
APP_AI_ENABLED=false
APP_AI_RAG_ENABLED=false
APP_AI_ASSISTANT_NAME=Induo Assistant
OLLAMA_BASE_URL=http://localhost:11434
AI_CHAT_MODEL=llama3.1:8b
AI_EMBEDDING_MODEL=nomic-embed-text
```

## API

<details>
<summary>Auth — /api/auth</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET  | /api/auth/me | Current user |

</details>

<details>
<summary>AI Chat — /api/chat</summary>

Requires authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/chat/status | AI module status |
| GET | /api/chat/sessions | User chat sessions |
| GET | /api/chat/sessions/{sessionId}/messages | Session history |
| POST | /api/chat/message | Send message to model |

</details>

<details>
<summary>Properties — /api/properties</summary>

Public endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/properties | Paginated list |
| GET | /api/properties/{id} | Property details |
| GET | /api/properties/search?city=&propertyType= | Search |
| GET | /api/properties/city/{city} | Filter by city |
| GET | /api/properties/type/{type} | Filter by type |
| GET | /api/properties/price-range?minPrice=&maxPrice= | Price range |
| GET | /api/properties/user/{userId} | User listings |

Requires authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/properties/my | My listings |
| POST   | /api/properties | Create listing |
| PATCH  | /api/properties/{id} | Update listing |
| DELETE | /api/properties/{id} | Delete listing |
| POST   | /api/properties/{id}/images | Upload image |
| DELETE | /api/properties/{propertyId}/images/{imageId} | Delete image |

</details>

## Example

```http
POST /api/properties
Content-Type: application/json

{
  "title": "Spacious apartment in the city centre",
  "price": 650000,
  "area": 72,
  "city": "Krakow",
  "street": "Florjanska 5",
  "postalCode": "31-000",
  "numberOfRooms": 3,
  "floor": 2,
  "totalFloors": 8,
  "transactionType": "SALE",
  "propertyType": "APARTMENT"
}
```

`propertyType`: `APARTMENT` | `HOUSE` | `LAND`  
`transactionType`: `SALE` | `RENT`

## Tests

```bash
cd induo-house
./mvnw test
```

49 tests total. Unit tests use Mockito, integration tests run against a real PostgreSQL instance spun up automatically via Testcontainers — no manual database setup required.

| Class | Type | Count |
|---|---|---|
| AuthControllerTest | Integration | 7 |
| PropertyControllerTest | Integration | 6 |
| PropertyIntegrationTest | Integration (DB) | 7 |
| PropertyServiceTest | Unit | 9 |
| AuthServiceTest | Unit | 8 |
| PropertyMapperTest | Unit | 11 |
| InduoHouseApplicationTests | Smoke | 1 |

## Security

Passwords are hashed with BCrypt. JWT tokens are signed with a secret loaded from environment variables and stored in httpOnly cookies. Cookie behavior (`Secure`, `SameSite`, max age) is configurable per environment. Public users can only read listings, while creating or modifying listings requires authentication and resource-level authorization ensures only the owner can modify or delete their listing.

## License

MIT

---

# Induo House PL

Aplikacja full-stack do zarządzania ogłoszeniami nieruchomości. Użytkownik może zakładać konto, dodawać ogłoszenia ze zdjęciami oraz przeglądać i filtrować oferty innych użytkowników.

Backend: Java 21, Spring Boot, PostgreSQL, Flyway, Spring Security, JWT, Testcontainers

Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, TanStack Query, Leaflet

Pełna dokumentacja dostępna powyżej w wersji angielskiej.
