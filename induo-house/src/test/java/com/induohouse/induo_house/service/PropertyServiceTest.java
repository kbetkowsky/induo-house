package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.mapper.PropertyMapper;
import com.induohouse.induo_house.repository.PropertyRepository;
import com.induohouse.induo_house.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock private PropertyRepository propertyRepository;
    @Mock private UserRepository userRepository;
    @Mock private PropertyMapper propertyMapper;

    @InjectMocks
    private PropertyService propertyService;

    private Property testProperty;
    private User testUser;
    private PropertyResponse testResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Jan");

        testProperty = new Property();
        testProperty.setId(1L);
        testProperty.setTitle("Piękne mieszkanie");
        testProperty.setPrice(new BigDecimal("500000"));
        testProperty.setCity("Warszawa");
        testProperty.setUser(testUser);

        testResponse = new PropertyResponse();
        testResponse.setId(1L);
        testResponse.setTitle("Piękne mieszkanie");
        testResponse.setPrice(new BigDecimal("500000"));
    }

    @Test
    void getById_ShouldReturnProperty_WhenPropertyExists() {
        when(propertyRepository.findByIdWithImages(1L)).thenReturn(Optional.of(testProperty));
        when(propertyMapper.toResponse(testProperty)).thenReturn(testResponse);

        PropertyResponse result = propertyService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Piękne mieszkanie", result.getTitle());
        verify(propertyRepository).findByIdWithImages(1L);
        verify(propertyMapper).toResponse(testProperty);
    }

    @Test
    void getById_ShouldThrowException_WhenPropertyNotFound() {
        when(propertyRepository.findByIdWithImages(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> propertyService.getById(999L));

        assertEquals("Nie znaleziono ogloszenia", ex.getMessage());
        verify(propertyMapper, never()).toResponse(any());
    }


    @Test
    void delete_ShouldDeleteProperty_WhenUserIsOwner() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        propertyService.delete(1L, 1L);

        verify(propertyRepository).delete(testProperty);
    }

    @Test
    void delete_ShouldThrowException_WhenUserIsNotOwner() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> propertyService.delete(2L, 1L));

        assertEquals("Mozesz kasowac tylko swoje ogloszenia", ex.getMessage());
        verify(propertyRepository, never()).delete(any());
    }

    @Test
    void create_ShouldCreateProperty_WhenUserExists() {
        CreatePropertyRequest request = buildRequest();
        Property mapped = new Property();
        Property saved = new Property();
        saved.setId(99L);
        saved.setUser(testUser);

        PropertyResponse expectedResponse = new PropertyResponse();
        expectedResponse.setId(99L);
        expectedResponse.setTitle("Nowe mieszkanie");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(propertyMapper.toEntity(request)).thenReturn(mapped);
        when(propertyRepository.save(mapped)).thenReturn(saved);
        when(propertyMapper.toResponse(saved)).thenReturn(expectedResponse);

        PropertyResponse result = propertyService.create(request, 1L);

        assertNotNull(result);
        assertEquals(99L, result.getId());
        assertEquals("Nowe mieszkanie", result.getTitle());
        verify(userRepository).findById(1L);
        verify(propertyRepository).save(mapped);
    }

    @Test
    void create_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> propertyService.create(buildRequest(), 999L));

        assertEquals("Nie ma takiego usera", ex.getMessage());
        verify(propertyRepository, never()).save(any());
    }

    private CreatePropertyRequest buildRequest() {
        CreatePropertyRequest r = new CreatePropertyRequest();
        r.setTitle("Nowe mieszkanie");
        r.setDescription("Opis");
        r.setPrice(new BigDecimal("600000"));
        r.setArea(new BigDecimal("65"));
        r.setCity("Kraków");
        r.setStreet("Floriańska");
        r.setPostalCode("31-000");
        r.setNumberOfRooms(3);
        r.setFloor(2);
        r.setTotalFloors(8);
        r.setTransactionType("SPRZEDAŻ");
        r.setPropertyType("MIESZKANIE");
        return r;
    }
}
