package com.induohouse.induo_house.mapper;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyImageResponse;
import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyOwnerResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.PropertyImage;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PropertyMapper {

    public Property toEntity(CreatePropertyRequest request) {

        Property property = new Property();

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setArea(request.getArea());
        property.setCity(request.getCity());
        property.setStreet(request.getStreet());
        property.setPostalCode(request.getPostalCode());
        property.setNumberOfRooms(request.getNumberOfRooms());
        property.setFloor(request.getFloor());
        property.setTotalFloors(request.getTotalFloors());
        property.setTransactionType(request.getTransactionType());
        property.setPropertyType(request.getPropertyType());
        property.setStatus("ACTIVE");

        return property;
    }

    public PropertyResponse toResponse(Property property) {

        PropertyResponse response = new PropertyResponse();

        response.setId(property.getId());
        response.setTitle(property.getTitle());
        response.setDescription(property.getDescription());
        response.setPrice(property.getPrice());
        response.setArea(property.getArea());
        response.setCity(property.getCity());
        response.setStreet(property.getStreet());
        response.setPostalCode(property.getPostalCode());
        response.setNumberOfRooms(property.getNumberOfRooms());
        response.setFloor(property.getFloor());
        response.setTotalFloors(property.getTotalFloors());
        response.setTransactionType(property.getTransactionType());
        response.setPropertyType(property.getPropertyType());
        response.setStatus(property.getStatus());
        response.setCreatedAt(property.getCreatedAt());
        response.setUpdatedAt(property.getUpdatedAt());
        List<PropertyImageResponse> images = property.getImages().stream()
                .map(img -> {
                    PropertyImageResponse ir = new PropertyImageResponse();
                    ir.setId(img.getId());
                    ir.setUrl(img.getUrl());
                    ir.setPrimary(img.isPrimary());
                    ir.setSortOrder(img.getSortOrder());
                    return ir;
                }).toList();
        response.setImages(images);

        PropertyOwnerResponse owner = new PropertyOwnerResponse();

        owner.setId(property.getUser().getId());
        owner.setFirstName(property.getUser().getFirstName());
        owner.setLastName(property.getUser().getLastName());
        owner.setEmail(property.getUser().getEmail());
        owner.setPhoneNumber(property.getUser().getPhoneNumber());

        response.setOwner(owner);
        return response;
    }

    public PropertyListResponse toListResponse(Property property) {

        PropertyListResponse response = new PropertyListResponse();

        response.setId(property.getId());
        response.setTitle(property.getTitle());
        response.setId(property.getId());
        response.setTitle(property.getTitle());
        response.setPrice(property.getPrice());
        response.setArea(property.getArea());
        response.setCity(property.getCity());
        response.setNumberOfRooms(property.getNumberOfRooms());
        response.setTransactionType(property.getTransactionType());
        response.setPropertyType(property.getPropertyType());
        response.setStatus(property.getStatus());
        property.getImages().stream()
                .filter(PropertyImage::isPrimary)
                .findFirst()
                .ifPresent(img -> response.setThumbnailUrl(img.getUrl()));

        response.setOwnerFirstName(property.getUser().getFirstName());
        response.setOwnerLastName(property.getUser().getLastName());
        response.setOwnerPhoneNumber(property.getUser().getPhoneNumber());

        return response;
    }


}
