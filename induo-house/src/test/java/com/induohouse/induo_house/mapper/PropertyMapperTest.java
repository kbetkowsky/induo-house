package com.induohouse.induo_house.mapper;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PropertyMapperTest {
    private PropertyMapper propertyMapper;

    @BeforeEach
    void setUp() {
        propertyMapper = new PropertyMapper();
    }

    @Test
    void toEntity_ShouldMapAllFields_WhenRequestIsValid() {
        //GIVEN
        CreatePropertyRequest request = new CreatePropertyRequest();
        request.setTitle("Piękne mieszkanie");
        request.setDescription("Świetna lokalizacja w centrum");
        request.setPrice(new BigDecimal("500000"));
        request.setArea(new BigDecimal("50"));
        request.setCity("Kraków");
        request.setStreet("Krowoderska");
        request.setPostalCode("00-001");
        request.setNumberOfRooms(3);
        request.setFloor(2);
        request.setTotalFloors(5);
        request.setTransactionType("SPRZEDAŻ");
        request.setPropertyType("MIESZKANIE");

        //WHEN
        Property result = propertyMapper.toEntity(request);

        //THEN
        assertNotNull(result, "Property nie powinno być null");

        assertEquals("Piękne mieszkanie", result.getTitle());
        assertEquals("Świetna lokalizacja w centrum", result.getDescription());
        assertEquals(new BigDecimal("500000"), result.getPrice());
        assertEquals(new BigDecimal("50"), result.getArea());
        assertEquals("Kraków", result.getCity());
        assertEquals("Krowoderska", result.getStreet());
        assertEquals("00-001", result.getPostalCode());
        assertEquals(3, result.getNumberOfRooms());
        assertEquals(2, result.getFloor());
        assertEquals(5, result.getTotalFloors());
        assertEquals("SPRZEDAŻ", result.getTransactionType());
        assertEquals("MIESZKANIE", result.getPropertyType());
        assertEquals("ACTIVE", result.getStatus());
    }

    @Test
    void toEntity_ShouldSetStatusToActive_Always() {
        //GIVEN
        CreatePropertyRequest request = new CreatePropertyRequest();
        request.setTitle("Test");
        request.setPrice(new BigDecimal("100000"));

        Property result = propertyMapper.toEntity(request);

        assertEquals("ACTIVE", result.getStatus(),
                "Status powinien być zawsze ustawiony na ACTIVE");
    }

    @Test
    void toEntity_ShouldWork_WithMinimalData() {
        //GIVEN
        CreatePropertyRequest request = new CreatePropertyRequest();
        request.setTitle("Minimalne dane");
        request.setPrice(new BigDecimal("200000"));
        request.setCity("Kraków");

        //WHEN
        Property result = propertyMapper.toEntity(request);

        //THEN
        assertNotNull(result);
        assertEquals("Minimalne dane", result.getTitle());
        assertEquals(new BigDecimal("200000"), result.getPrice());
        assertEquals("Kraków", result.getCity());
        assertEquals("ACTIVE", result.getStatus());
    }

    @Test
    void toResponse_ShouldMapAllPropertyFields() {
        //GIVEN
        User owner = new User();
        owner.setId(1L);
        owner.setFirstName("Jan");
        owner.setLastName("Kowalski");
        owner.setEmail("jan.kowalski@example.com");
        owner.setPhoneNumber("123456789");

        Property property = new Property();
        property.setId(10L);
        property.setTitle("Mieszkanie w centrum");
        property.setDescription("Piękne mieszkanie");
        property.setPrice(new BigDecimal("600000"));
        property.setArea(new BigDecimal("60"));
        property.setCity("Warszawa");
        property.setStreet("Nowa");
        property.setPostalCode("00-123");
        property.setNumberOfRooms(3);
        property.setFloor(4);
        property.setTotalFloors(10);
        property.setTransactionType("SPRZEDAŻ");
        property.setPropertyType("MIESZKANIE");
        property.setStatus("ACTIVE");
        property.setCreatedAt(LocalDateTime.now());
        property.setUpdatedAt(LocalDateTime.now());
        property.setUser(owner);

        //WHEN
        PropertyResponse result = propertyMapper.toResponse(property);

        //THEN
        assertNotNull(result, "PropertyResponse nie powinno być null");
        assertEquals(10L, result.getId());
        assertEquals("Mieszkanie w centrum", result.getTitle());
        assertEquals("Piękne mieszkanie", result.getDescription());
        assertEquals(new BigDecimal("600000"), result.getPrice());
        assertEquals(new BigDecimal("60"), result.getArea());
        assertEquals("Warszawa", result.getCity());
        assertEquals("Nowa", result.getStreet());
        assertEquals("00-123", result.getPostalCode());
        assertEquals(3, result.getNumberOfRooms());
        assertEquals(4, result.getFloor());
        assertEquals(10, result.getTotalFloors());
        assertEquals("SPRZEDAŻ", result.getTransactionType());
        assertEquals("MIESZKANIE", result.getPropertyType());
        assertEquals("ACTIVE", result.getStatus());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        assertNotNull(result.getOwner(), "Owner nie powinien być null");
        assertEquals(1L, result.getOwner().getId());
        assertEquals("Jan", result.getOwner().getFirstName());
        assertEquals("Kowalski", result.getOwner().getLastName());
        assertEquals("jan.kowalski@example.com", result.getOwner().getEmail());
        assertEquals("123456789", result.getOwner().getPhoneNumber());
    }

















































}