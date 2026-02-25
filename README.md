# Induo House 🏠

Full-stack aplikacja do zarządzania ogłoszeniami nieruchomości — sprzedaż i wynajem.
Użytkownicy mogą zakładać konta, publikować ogłoszenia ze zdjęciami oraz przeglądać
i filtrować oferty innych.

## Tech stack

### Backend
| Warstwa | Technologia |
|---|---|
| Język / Framework | Java 21, Spring Boot 4 |
| Baza danych | PostgreSQL, Spring Data JPA, Hibernate |
| Migracje | Flyway |
| Bezpieczeństwo | Spring Security, JWT |
| Testy | JUnit 5, Mockito, Testcontainers |
| Build | Maven |

### Frontend
| Warstwa | Technologia |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Stylowanie | Tailwind CSS v4 |
| Formularze | React Hook Form + Zod |
| Dane | TanStack React Query, Axios |
| Mapa | Leaflet / React Leaflet |

## Struktura projektu

```
induo-house/             # Spring Boot backend
induo-house-frontend/    # Next.js frontend
```

## Architektura

### Przepływ żądania (backend)

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────────────────┐
│                   Spring Security                    │
│         JWT Filter → Authentication/Authorization    │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      Controller       │  @RestController
              │  (walidacja wejścia,  │  @Valid na DTO
              │   mapowanie DTO)      │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │       Service         │  logika biznesowa,
              │                       │  autoryzacja właściciela,
              │                       │  obsługa wyjątków
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      Repository       │  Spring Data JPA
              │                       │  + Specification API
              │                       │  (filtrowanie, paginacja)
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      PostgreSQL        │  Flyway migracje
              └───────────────────────┘
```

### Przepływ żądania (full-stack)

```
Przeglądarka (Next.js)
     │  Axios + React Query
     ▼
Spring Boot API (:8080)
     │  JPA / Hibernate
     ▼
PostgreSQL
```

### Warstwy backendu

| Warstwa | Odpowiedzialność |
|---|---|
| **Controller** | Przyjmuje HTTP, waliduje DTO (`@Valid`), zwraca ResponseEntity |
| **Service** | Logika biznesowa, weryfikacja uprawnień, obsługa wyjątków |
| **Repository** | Dostęp do bazy, zapytania przez Specification API |
| **Mapper** | Konwersja Entity ↔ DTO (bez zależności między warstwami) |
| **Security** | JWT filter, BCrypt, konfiguracja dostępu per endpoint |
| **Exception** | `GlobalExceptionHandler` → spójne odpowiedzi błędów w formacie JSON |

## Pierwsze uruchomienie

**Wymagania:** Java 21+, Node.js 18+, Docker

### Backend

```bash
# 1. Uruchom bazę danych
cd induo-house
docker-compose up -d

# 2. Ustaw zmienne środowiskowe
export DB_PASSWORD=twoje_haslo
export JWT_SECRET=twoj_secret

# 3. Uruchom aplikację
./mvnw spring-boot:run
```

API docs (Swagger): `http://localhost:8080/swagger-ui/index.html`

### Frontend

```bash
cd induo-house-frontend
npm install
npm run dev
```

App: `http://localhost:3000`

## API

<details>
<summary><strong>Auth</strong> — /api/auth</summary>

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/auth/register` | Rejestracja |
| `POST` | `/api/auth/login` | Logowanie |
| `POST` | `/api/auth/logout` | Wylogowanie |
| `GET` | `/api/auth/me` | Dane zalogowanego użytkownika |

</details>

<details>
<summary><strong>Ogłoszenia</strong> — /api/properties</summary>

**Publiczne**

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/properties` | Lista z paginacją |
| `GET` | `/api/properties/{id}` | Szczegóły ogłoszenia |
| `GET` | `/api/properties/search?city=&propertyType=` | Wyszukiwanie |
| `GET` | `/api/properties/city/{city}` | Filtr po mieście |
| `GET` | `/api/properties/type/{type}` | Filtr po typie |
| `GET` | `/api/properties/price-range?minPrice=&maxPrice=` | Filtr cenowy |
| `GET` | `/api/properties/user/{userId}` | Ogłoszenia użytkownika |

**Wymagają zalogowania**

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/properties/my` | Moje ogłoszenia |
| `POST` | `/api/properties` | Nowe ogłoszenie |
| `PATCH` | `/api/properties/{id}` | Edycja ogłoszenia |
| `DELETE` | `/api/properties/{id}` | Usunięcie ogłoszenia |
| `POST` | `/api/properties/{id}/images` | Dodaj zdjęcie |
| `DELETE` | `/api/properties/{propertyId}/images/{imageId}` | Usuń zdjęcie |

</details>

## Przykład — nowe ogłoszenie

```http
POST /api/properties
Content-Type: application/json

{
  "title": "Przestronne mieszkanie w centrum",
  "price": 650000,
  "area": 72,
  "city": "Kraków",
  "street": "Floriańska 5",
  "postalCode": "31-000",
  "numberOfRooms": 3,
  "floor": 2,
  "totalFloors": 8,
  "transactionType": "SALE",
  "propertyType": "APARTMENT"
}
```

> `propertyType`: `APARTMENT` | `HOUSE` | `LAND`
> `transactionType`: `SALE` | `RENT`

## Testy

```bash
cd induo-house
./mvnw test
```

Testy integracyjne używają `@SpringBootTest` + **Testcontainers** — PostgreSQL
odpala się automatycznie w Dockerze, zero ręcznej konfiguracji.

## Bezpieczeństwo

- JWT authentication
- Hasła hashowane **BCryptem**
- Zmienne środowiskowe dla sekretów (`DB_PASSWORD`, `JWT_SECRET`)
