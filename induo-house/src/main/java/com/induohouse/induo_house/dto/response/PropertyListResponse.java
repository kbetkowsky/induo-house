package com.induohouse.induo_house.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PropertyListResponse {
    private Long id;
    private String title;
    private BigDecimal price;
    private BigDecimal area;
    private String city;
    private Integer numberOfRooms;
    private String transactionType;
    private String propertyType;
    private String status;
    private String thumbnailUrl;

    private String ownerFirstName;
    private String ownerLastName;
    private String ownerPhoneNumber;
}
