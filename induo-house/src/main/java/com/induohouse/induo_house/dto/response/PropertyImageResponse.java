package com.induohouse.induo_house.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PropertyImageResponse {
    private Long id;
    private String url;
    private boolean isPrimary;
    private Integer sortOrder;
}
