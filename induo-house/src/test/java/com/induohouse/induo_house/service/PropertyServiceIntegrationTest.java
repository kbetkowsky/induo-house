package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.repository.PropertyRepository;
import com.induohouse.induo_house.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;
import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;
import java.util.Optional;

@SpringBootTest
@Testcontainers
@Transactional
public class PropertyServiceIntegrationTest {
    @Container
    @ServiceConnection
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    private final PropertyService propertyService;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private User testUser;

    public PropertyServiceIntegrationTest(PropertyService propertyService, PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyService = propertyService;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @BeforeEach
    void setUp() {
        propertyRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User();
        testUser.setEmail("jan.kowalski@test.com");
        testUser.setPasswordHash("$2a$10$dummyHashForTesting");
        testUser.setFirstName("Jan");
        testUser.setLastName("Kowalski");
        testUser.setPhoneNumber("123456789");
        testUser.setRole(User.Role.USER);
        testUser.setIsEmailVerified(true);

        testUser = userRepository.save(testUser);
        System.out.println("[SETUP] utworzono testUser o id: " + testUser.getId());
    }

    @Test
    void create_ShouldSavePropertyToPostgres_WhenUserExists() {
        System.out.println("[TEST] testowanie create");
        //GIVEN
        CreatePropertyRequest request = new CreatePropertyRequest();
        request.setTitle("Mieszkanie w Warszawie");
        request.setDescription("Piękne mieszkanie po remoncie");
        request.setPrice(new BigDecimal("650000.00"));
        request.setArea(new BigDecimal("55.50"));
        request.setCity("Warszawa");
        request.setStreet("Marszałkowska");
        request.setPostalCode("00-624");
        request.setNumberOfRooms(3);
        request.setFloor(4);
        request.setTotalFloors(10);
        request.setTransactionType("SPRZEDAŻ");
        request.setPropertyType("MIESZKANIE");

        //WHEN
        PropertyResponse result = propertyService.create(request, testUser.getId());

        //THEN
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("Mieszkanie w Warszawie", result.getTitle());
        assertEquals(new BigDecimal("650000.00"), result.getPrice());
        assertEquals(new BigDecimal("55.50"), result.getArea());
        assertEquals("Warszawa", result.getCity());
        assertEquals("ACTIVE", result.getStatus());

        assertNotNull(result.getOwner());
        assertEquals(testUser.getId(), result.getOwner().getId());
        assertEquals("Jan", result.getOwner().getFirstName());
        assertEquals("Kowalski", result.getOwner().getLastName());

        Optional<Property> savedProperty = propertyRepository.findById(result.getId());
        assertTrue(savedProperty.isPresent());

        Property dbProperty = savedProperty.get();

        assertEquals("Mieszkanie w Warszawie", dbProperty.getTitle());
        assertEquals(new BigDecimal("650000.00"), dbProperty.getPrice());
        assertEquals("Warszawa", dbProperty.getCity());
        assertEquals(testUser.getId(), dbProperty.getUser().getId());
        //assertNull(dbProperty.getImageUrl());
    }
}
