package com.induohouse.induo_house.mapper;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.PropertyImage;
import com.induohouse.induo_house.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PropertyMapperTest {

    private PropertyMapper mapper;

    private User testUser;
    private Property testProperty;

    @BeforeEach
    void setUp() {
        mapper = new PropertyMapper();

        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("Jan");
        testUser.setLastName("Kowalski");
        testUser.setEmail("jan@test.com");
        testUser.setPhoneNumber("123456789");
        testUser.setPasswordHash("hash");
        testUser.setRole(User.Role.USER);

        testProperty = new Property();
        testProperty.setId(10L);
        testProperty.setTitle("Mieszkanie w centrum");
        testProperty.setDescription("Opis ogłoszenia");
        testProperty.setPrice(new BigDecimal("500000"));
        testProperty.setArea(new BigDecimal("65"));
        testProperty.setCity("Warszawa");
        testProperty.setStreet("Marszałkowska 1");
        testProperty.setPostalCode("00-001");
        testProperty.setNumberOfRooms(3);
        testProperty.setFloor(2);
        testProperty.setTotalFloors(8);
        testProperty.setTransactionType("SPRZEDAŻ");
        testProperty.setPropertyType("MIESZKANIE");
        testProperty.setStatus("ACTIVE");
        testProperty.setUser(testUser);
        testProperty.setImages(new ArrayList<>());
    }

    @Test
    void toEntity_ShouldMapAllFields_FromRequest() {
        CreatePropertyRequest request = buildRequest();

        Property result = mapper.toEntity(request);

        assertNotNull(result);
        assertEquals("Nowe mieszkanie", result.getTitle());
        assertEquals("Opis", result.getDescription());
        assertEquals(new BigDecimal("600000"), result.getPrice());
        assertEquals(new BigDecimal("70"), result.getArea());
        assertEquals("Kraków", result.getCity());
        assertEquals("Floriańska 5", result.getStreet());
        assertEquals("31-000", result.getPostalCode());
        assertEquals(4, result.getNumberOfRooms());
        assertEquals(3, result.getFloor());
        assertEquals(10, result.getTotalFloors());
        assertEquals("SPRZEDAŻ", result.getTransactionType());
        assertEquals("MIESZKANIE", result.getPropertyType());
    }

    @Test
    void toEntity_ShouldSetStatusToActive() {
        Property result = mapper.toEntity(buildRequest());

        assertEquals("ACTIVE", result.getStatus());
    }

    @Test
    void toEntity_ShouldNotSetUser_BecauseRequestHasNoUser() {
        Property result = mapper.toEntity(buildRequest());

        assertNull(result.getUser());
    }

    @Test
    void toResponse_ShouldMapAllBasicFields() {
        PropertyResponse result = mapper.toResponse(testProperty);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Mieszkanie w centrum", result.getTitle());
        assertEquals("Opis ogłoszenia", result.getDescription());
        assertEquals(new BigDecimal("500000"), result.getPrice());
        assertEquals(new BigDecimal("65"), result.getArea());
        assertEquals("Warszawa", result.getCity());
        assertEquals("Marszałkowska 1", result.getStreet());
        assertEquals("00-001", result.getPostalCode());
        assertEquals(3, result.getNumberOfRooms());
        assertEquals(2, result.getFloor());
        assertEquals(8, result.getTotalFloors());
        assertEquals("SPRZEDAŻ", result.getTransactionType());
        assertEquals("MIESZKANIE", result.getPropertyType());
        assertEquals("ACTIVE", result.getStatus());
    }

    @Test
    void toResponse_ShouldMapOwnerCorrectly() {
        PropertyResponse result = mapper.toResponse(testProperty);

        assertNotNull(result.getOwner());
        assertEquals(1L, result.getOwner().getId());
        assertEquals("Jan", result.getOwner().getFirstName());
        assertEquals("Kowalski", result.getOwner().getLastName());
        assertEquals("jan@test.com", result.getOwner().getEmail());
        assertEquals("123456789", result.getOwner().getPhoneNumber());
    }

    @Test
    void toResponse_ShouldReturnEmptyImageList_WhenNoImages() {
        PropertyResponse result = mapper.toResponse(testProperty);

        assertNotNull(result.getImages());
        assertTrue(result.getImages().isEmpty());
    }

    @Test
    void toResponse_ShouldMapImages_WhenImagesPresent() {
        PropertyImage img = new PropertyImage();
        img.setId(1L);
        img.setUrl("https://example.com/photo.jpg");
        img.setPrimary(true);
        img.setSortOrder(0);
        testProperty.setImages(List.of(img));

        PropertyResponse result = mapper.toResponse(testProperty);

        assertEquals(1, result.getImages().size());
        assertEquals("https://example.com/photo.jpg", result.getImages().get(0).getUrl());
        assertTrue(result.getImages().get(0).isPrimary());
        assertEquals(0, result.getImages().get(0).getSortOrder());
    }

    @Test
    void toListResponse_ShouldMapBasicFields() {
        PropertyListResponse result = mapper.toListResponse(testProperty);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Mieszkanie w centrum", result.getTitle());
        assertEquals(new BigDecimal("500000"), result.getPrice());
        assertEquals(new BigDecimal("65"), result.getArea());
        assertEquals("Warszawa", result.getCity());
        assertEquals(3, result.getNumberOfRooms());
        assertEquals("SPRZEDAŻ", result.getTransactionType());
        assertEquals("MIESZKANIE", result.getPropertyType());
        assertEquals("ACTIVE", result.getStatus());
    }

    @Test
    void toListResponse_ShouldMapOwnerName() {
        PropertyListResponse result = mapper.toListResponse(testProperty);

        assertEquals("Jan", result.getOwnerFirstName());
        assertEquals("Kowalski", result.getOwnerLastName());
        assertEquals("123456789", result.getOwnerPhoneNumber());
    }

    @Test
    void toListResponse_ShouldSetThumbnailUrl_WhenPrimaryImageExists() {
        PropertyImage primary = new PropertyImage();
        primary.setId(1L);
        primary.setUrl("https://example.com/primary.jpg");
        primary.setPrimary(true);
        primary.setSortOrder(0);

        PropertyImage secondary = new PropertyImage();
        secondary.setId(2L);
        secondary.setUrl("https://example.com/secondary.jpg");
        secondary.setPrimary(false);
        secondary.setSortOrder(1);

        testProperty.setImages(List.of(secondary, primary));

        PropertyListResponse result = mapper.toListResponse(testProperty);

        assertEquals("https://example.com/primary.jpg", result.getThumbnailUrl());
    }

    @Test
    void toListResponse_ShouldNotSetThumbnailUrl_WhenNoPrimaryImage() {
        PropertyImage nonPrimary = new PropertyImage();
        nonPrimary.setId(1L);
        nonPrimary.setUrl("https://example.com/photo.jpg");
        nonPrimary.setPrimary(false);
        testProperty.setImages(List.of(nonPrimary));

        PropertyListResponse result = mapper.toListResponse(testProperty);

        assertNull(result.getThumbnailUrl());
    }

    private CreatePropertyRequest buildRequest() {
        CreatePropertyRequest request = new CreatePropertyRequest();
        request.setTitle("Nowe mieszkanie");
        request.setDescription("Opis");
        request.setPrice(new BigDecimal("600000"));
        request.setArea(new BigDecimal("70"));
        request.setCity("Kraków");
        request.setStreet("Floriańska 5");
        request.setPostalCode("31-000");
        request.setNumberOfRooms(4);
        request.setFloor(3);
        request.setTotalFloors(10);
        request.setTransactionType("SPRZEDAŻ");
        request.setPropertyType("MIESZKANIE");
        return request;
    }
}
