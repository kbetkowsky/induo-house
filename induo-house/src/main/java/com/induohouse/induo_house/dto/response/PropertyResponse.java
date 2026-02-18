package com.induohouse.induo_house.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal area;
    private String city;
    private String street;
    private String postalCode;
    private Integer numberOfRooms;
    private Integer floor;
    private Integer totalFloors;
    private String transactionType;
    private String propertyType;
    private String status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PropertyOwnerResponse owner;
}
