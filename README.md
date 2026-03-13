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

## Environment variables

Copy `.env.example` to `.env`:

```
DB_PASSWORD=your_database_password
JWT_SECRET=your_random_secret_min_32_chars
```

Never commit `.env` — it is in `.gitignore`.

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

Passwords are hashed with BCrypt. JWT tokens are stored in httpOnly cookies. All secrets are passed via environment variables. Resource-level authorization ensures only the owner can modify or delete their listing.

## License

MIT

---

# Induo House PL

Aplikacja full-stack do zarządzania ogłoszeniami nieruchomości. Użytkownik może zakładać konto, dodawać ogłoszenia ze zdjęciami oraz przeglądać i filtrować oferty innych użytkowników.

Backend: Java 21, Spring Boot, PostgreSQL, Flyway, Spring Security, JWT, Testcontainers

Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, TanStack Query, Leaflet

Pełna dokumentacja dostępna powyżej w wersji angielskiej.
