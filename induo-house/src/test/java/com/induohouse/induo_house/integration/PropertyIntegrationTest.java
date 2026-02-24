package com.induohouse.induo_house.integration;

import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.repository.PropertyRepository;
import com.induohouse.induo_house.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class PropertyIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:15")
                    .withDatabaseName("testdb")
                    .withUsername("test")
                    .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    }

    @Autowired private PropertyRepository propertyRepository;
    @Autowired private UserRepository userRepository;

    private User savedUser;

    @BeforeEach
    void setUp() {
        propertyRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setEmail("jan@test.com");
        user.setPasswordHash("$2a$10$hashedpassword");
        user.setFirstName("Jan");
        user.setLastName("Kowalski");
        user.setRole(User.Role.USER);
        savedUser = userRepository.save(user);
    }

    @Test
    void save_ShouldPersistProperty_WhenValid() {
        Property saved = propertyRepository.save(
                buildProperty("Mieszkanie w centrum", "Warszawa", new BigDecimal("500000")));

        assertNotNull(saved.getId());
        assertEquals("Mieszkanie w centrum", saved.getTitle());
        assertEquals("Warszawa", saved.getCity());
    }

    @Test
    void findById_ShouldReturnProperty_WhenExists() {
        Property saved = propertyRepository.save(
                buildProperty("Dom z ogrodem", "Kraków", new BigDecimal("900000")));

        Optional<Property> result = propertyRepository.findById(saved.getId());

        assertTrue(result.isPresent());
        assertEquals("Dom z ogrodem", result.get().getTitle());
    }

    @Test
    void findById_ShouldReturnEmpty_WhenNotExists() {
        Optional<Property> result = propertyRepository.findById(99999L);
        assertTrue(result.isEmpty());
    }

    @Test
    void delete_ShouldRemoveProperty() {
        Property saved = propertyRepository.save(
                buildProperty("Kawalerka", "Gdańsk", new BigDecimal("300000")));
        Long id = saved.getId();

        propertyRepository.delete(saved);

        assertTrue(propertyRepository.findById(id).isEmpty());
    }

    @Test
    void findByUserId_ShouldReturnOnlyUserProperties() {
        propertyRepository.save(buildProperty("Mieszkanie 1", "Warszawa", new BigDecimal("400000")));
        propertyRepository.save(buildProperty("Mieszkanie 2", "Kraków", new BigDecimal("450000")));

        Page<Property> page = propertyRepository.findByUserId(
                savedUser.getId(), PageRequest.of(0, 10));

        assertEquals(2, page.getTotalElements());
    }

    private Property buildProperty(String title, String city, BigDecimal price) {
        Property p = new Property();
        p.setTitle(title);
        p.setDescription("Opis ogłoszenia");
        p.setPrice(price);
        p.setArea(new BigDecimal("60"));
        p.setCity(city);
        p.setStreet("Testowa 1");
        p.setPostalCode("00-001");
        p.setNumberOfRooms(3);
        p.setFloor(2);
        p.setTotalFloors(8);
        p.setTransactionType("SPRZEDAŻ");
        p.setPropertyType("MIESZKANIE");
        p.setUser(savedUser);
        return p;
    }
}
