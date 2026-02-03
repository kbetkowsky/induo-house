package com.induohouse.induo_house.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyOwnerResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
}
