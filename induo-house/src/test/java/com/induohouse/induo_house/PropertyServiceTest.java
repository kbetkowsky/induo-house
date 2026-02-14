package com.induohouse.induo_house;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.mapper.PropertyMapper;
import com.induohouse.induo_house.repository.PropertyRepository;
import com.induohouse.induo_house.repository.UserRepository;
import com.induohouse.induo_house.service.PropertyService;
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
public class PropertyServiceTest {
    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PropertyMapper propertyMapper;

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
        testUser.setFirstName("testuser");

        testProperty = new Property();
        testProperty.setId(1L);
        testProperty.setTitle("Piękne mieszkanie");
        testProperty.setDescription("Świetna lokalizacja");
        testProperty.setPrice(new BigDecimal("500000"));
        testProperty.setCity("Warszawa");
        testProperty.setUser(testUser);

        testResponse = new PropertyResponse();
        testResponse.setId(1L);
        testResponse.setTitle("Piękne mieszkanie");
        testResponse.setPrice(new BigDecimal("500000"));
    }

    @Test
    void getById_ShouldReturnProperty_WhenPropertyExist() {
        //GIVEN
        when(propertyRepository.findById(1L))
                .thenReturn(Optional.of(testProperty));
        when(propertyMapper.toResponse(testProperty))
                .thenReturn(testResponse);

        //WHEN
        PropertyResponse result = propertyService.getById(1L);

        //THEN
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Piękne mieszkanie", result.getTitle());

        verify(propertyRepository, times(1)).findById(1L);
        verify(propertyMapper, times(1)).toResponse(testProperty);
    }

    @Test
    void getById_ShouldReturnProperty_WhenPropertyExists() {
        //GIVEN
        when(propertyRepository.findById(1L))
                .thenReturn(Optional.of(testProperty));
        when(propertyMapper.toResponse(testProperty))
                .thenReturn(testResponse);

        //WHEN
        PropertyResponse result = propertyService.getById(1L);

        //THEN
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Piękne mieszkanie", result.getTitle());

        verify(propertyRepository, times(1)).findById(1L);
        verify(propertyMapper, times(1)).toResponse(testProperty);
    }

    @Test
    void getById_ShouldThrowException_WhenPropertyNotFound() {
        //GIVEN
        when(propertyRepository.findById(999L))
                .thenReturn(Optional.empty());

        //WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> propertyService.getById(999L)
        );

        assertEquals("Nie znaleziono ogloszenia", exception.getMessage());

        verify(propertyMapper, never()).toResponse(any());
    }

    @Test
    void mocksShouldNotBeNull() {
        assertNotNull(propertyRepository, "PropertyRepository mock powinien istnieć");
        assertNotNull(userRepository, "UserRepository mock powinien istnieć");
        assertNotNull(propertyMapper, "PropertyMapper mock powinien istnieć");
        assertNotNull(propertyService, "PropertyService powinien być utworzony");
    }

    @Test
    void delete_ShouldDeleteProperty_WhenUserIsOwner(){
        Long userId = 1L;
        Long propertyId = 1L;

        //WHEN
        when(propertyRepository.findById(propertyId))
                .thenReturn(Optional.of(testProperty));

        propertyService.delete(userId, propertyId);
        verify(propertyRepository, times(1)).delete(testProperty);
        verify(propertyRepository, times(1)).findById(propertyId);
    }

    @Test
    void delete_ShouldNotDeleteProperty_WhenUserIsntOwner() {
        Long userId = 1L;
        Long wrongUserId = 2L;
        Long propertyId = 1L;

        when(propertyRepository.findById(propertyId))
                .thenReturn(Optional.of(testProperty));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> propertyService.delete(wrongUserId, propertyId)
        );
        assertEquals("Mozesz kasowac tylko swoje ogloszenia", exception.getMessage());
        verify(propertyRepository, never()).delete(any());
    }

    private CreatePropertyRequest createTestRequest() {
        CreatePropertyRequest request = new CreatePropertyRequest();
        request.setTitle("Nowe mieszkanie");
        request.setDescription("Piękne mieszkanie w centrum");
        request.setPrice(new BigDecimal("600000"));
        request.setArea(new BigDecimal("65"));
        request.setCity("Kraków");
        request.setStreet("Floriańska");
        request.setPostalCode("31-000");
        request.setNumberOfRooms(4);
        request.setFloor(3);
        request.setTotalFloors(8);
        request.setTransactionType("SPRZEDAŻ");
        request.setPropertyType("MIESZKANIE");
        return request;
    }

    @Test
    void create_ShouldCreateProperty_WhenUserExists() {
        //GIVEN
        Long userId = 1L;
        CreatePropertyRequest request = createTestRequest();

        Property mappedProperty = new Property();
        mappedProperty.setTitle("Nowe mieszkanie");
        mappedProperty.setPrice(new BigDecimal("600000"));

        Property savedProperty = new Property();
        savedProperty.setId(99L);
        savedProperty.setTitle("Nowe mieszkanie");
        savedProperty.setPrice(new BigDecimal("600000"));
        savedProperty.setUser(testUser);

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(testUser));
        when(propertyMapper.toEntity(request))
                .thenReturn(mappedProperty);
        when(propertyRepository.save(mappedProperty))
                .thenReturn(savedProperty);
        when(propertyMapper.toResponse(savedProperty))
                .thenReturn(testResponse);

        //WHEN
        PropertyResponse result = propertyService.create(request, userId);

        //THEN
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Testowe mieszkanie", result.getTitle());

        verify(userRepository, times(1)).findById(userId);
        verify(propertyMapper, times(1)).toEntity(request);
        verify(propertyRepository, times(1)).save(mappedProperty);
        verify(propertyMapper, times(1)).toResponse(savedProperty);
    }

    @Test
    void create_ShouldThrowException_WhenUserNotFound() {
        //GIVEN
        Long nonExistentUserId = 999L;
        CreatePropertyRequest request = createTestRequest();

        when(userRepository.findById(nonExistentUserId))
                .thenReturn(Optional.empty());

        //WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> propertyService.create(request, nonExistentUserId)
        );

        assertEquals("Nie ma takiego usera", exception.getMessage());

        verify(propertyMapper, never()).toEntity(any());
        verify(propertyRepository, never()).save(any());
        verify(propertyMapper, never()).toResponse(any());
    }
}
