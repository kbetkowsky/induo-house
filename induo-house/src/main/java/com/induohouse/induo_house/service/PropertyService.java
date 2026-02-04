package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.request.UpdatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.mapper.PropertyMapper;
import com.induohouse.induo_house.repository.PropertyRepository;
import com.induohouse.induo_house.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/*
    TRZEBA BEDZIE ZMIENIC UPDATE Z RECZNEGO PATCH KAZDEJ !NULL NA MAPSTRUCT
    DOPRACOWAC WALIDACJE SORTOWANIA
 */
@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyMapper propertyMapper;

    public PropertyService(PropertyRepository propertyRepository, UserRepository userRepository, PropertyMapper propertyMapper) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyMapper = propertyMapper;
    }

    public Page<PropertyListResponse> getAll(Pageable pageable) {

       return propertyRepository.findAll(pageable)
               .map(propertyMapper::toListResponse);
    }

    public PropertyResponse getById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono ogloszenia"));
        return propertyMapper.toResponse(property);
    }



    public Page<PropertyListResponse> getByCity(String city, Pageable pageable) {
        return propertyRepository.findByCity(city, pageable)
                .map(propertyMapper::toListResponse);
    }

    public Page<PropertyListResponse> getByType(String propertyType, Pageable pageable) {
        return propertyRepository.findByPropertyType(propertyType, pageable)
                .map(propertyMapper::toListResponse);
    }

    public Page<PropertyListResponse> getByUserId(Long userId, Pageable pageable) {
            return propertyRepository.findByUserId(userId, pageable)
                    .map(propertyMapper::toListResponse);
        }


    public void deletePropertyById(Long id) {
        getById(id);
        propertyRepository.deleteById(id);
    }

    public PropertyResponse create(CreatePropertyRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie ma takiego usera"));

        Property property = propertyMapper.toEntity(request);
        property.setUser(user);
        Property saved = propertyRepository.save(property);
        return propertyMapper.toResponse(saved);
    }

    public PropertyResponse update(UpdatePropertyRequest request, Long userId, Long propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie ma takiego usera"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Nie ma takiego ogloszenia"));

        if (!property.getUser().getId().equals(userId)) {
            throw new RuntimeException("nie jestes autorem ogloszenia");
        }
        if (request.getTitle() != null) property.setTitle(request.getTitle());
        if (request.getDescription() != null) property.setDescription(request.getDescription());
        if (request.getPrice() != null) property.setPrice(request.getPrice());
        if (request.getArea() != null) property.setArea(request.getArea());
        if (request.getCity() != null) property.setCity(request.getCity());
        if (request.getStreet() != null) property.setStreet(request.getStreet());
        if (request.getPostalCode() != null) property.setPostalCode(request.getPostalCode());
        if (request.getNumberOfRooms() != null) property.setNumberOfRooms(request.getNumberOfRooms());
        if (request.getFloor() != null) property.setFloor(request.getFloor());
        if (request.getTotalFloors() != null) property.setTotalFloors(request.getTotalFloors());
        if (request.getTransactionType() != null) property.setTransactionType(request.getTransactionType());
        if (request.getPropertyType() != null) property.setPropertyType(request.getPropertyType());

        Property saved = propertyRepository.save(property);
        return propertyMapper.toResponse(saved);
    }

    public Page<PropertyListResponse> getByPriceRange(BigDecimal minPrice, BigDecimal maxPrice,
    Pageable pageable) {
        return propertyRepository.findByPriceBetween(minPrice, maxPrice, pageable)
                .map(propertyMapper::toListResponse);
    }

    }





