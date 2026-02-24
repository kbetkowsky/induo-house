# induo-house

Backend serwis do zarządzania ogłoszeniami nieruchomości — sprzedaż i wynajem.
Użytkownicy mogą zakładać konta, publikować ogłoszenia z zdjęciami oraz przeglądać
i filtrować oferty innych.

## Tech stack

| Warstwa | Technologia |
|---|---|
| Język / Framework | Java 22, Spring Boot 4 |
| Baza danych | PostgreSQL 18, Spring Data JPA, Hibernate 7 |
| Migracje | Flyway |
| Bezpieczeństwo | Spring Security, JWT w httpOnly cookie |
| Testy | JUnit 6, Mockito, Testcontainers |
| Build | Maven |

## Pierwsze uruchomienie

**Wymagania:** Java 22+, Docker

```bash
# 1. Uruchom PostgreSQL
# 1. Uruchom bazę danych
docker-compose up -d

# 2. Stwórz plik .env
echo "DB_PASSWORD=twoje_haslo" >> .env
echo "JWT_SECRET=twoj_secret" >> .env

# 3. Uruchom aplikację
./mvnw spring-boot:run
```
## API

<details>
<summary><strong>Auth</strong> — /api/auth</summary>

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/auth/register` | Rejestracja |
| `POST` | `/api/auth/login` | Logowanie → ustawia httpOnly cookie |
| `POST` | `/api/auth/logout` | Wylogowanie → czyści cookie |
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
  "propertyType": "APARTMENT",
  "imageUrl": "https://example.com/photo.jpg"
}
```

> `propertyType`: `APARTMENT` | `HOUSE` | `LAND`  
> `transactionType`: `SALE` | `RENT`

## Testy

```bash
./mvnw test
```

Testy integracyjne używają `@SpringBootTest` + **Testcontainers** — PostgreSQL
odpala się automatycznie w Dockerze, zero ręcznej konfiguracji.

## Bezpieczeństwo

- JWT w **httpOnly cookie** — JavaScript nie ma dostępu (ochrona XSS)
- **SameSite=Lax** na cookie (ochrona CSRF)
- Hasła hashowane **BCryptem**

