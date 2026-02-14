package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.response.PropertyOwnerResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.service.FileStorageService;
import com.induohouse.induo_house.service.PropertyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest
public class PropertyControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PropertyService propertyService;

    @MockitoBean
    private FileStorageService fileStorageService;

    @Test
    @WithMockUser
    void getById_ShouldReturnProperty_WhenPropertyExists() throws Exception {
        PropertyOwnerResponse owner = new PropertyOwnerResponse();
        owner.setId(10L);
        owner.setFirstName("Jan");
        owner.setLastName("Kowalski");
        owner.setEmail("jan.kowalski@example.com");
        owner.setPhoneNumber("123456789");

        PropertyResponse propertyResponse = new PropertyResponse();
        propertyResponse.setId(1L);
        propertyResponse.setTitle("Piękne mieszkanie w Warszawie");
        propertyResponse.setDescription("Mieszkanie po remoncie, 3 pokoje");
        propertyResponse.setPrice(new BigDecimal("650000"));
        propertyResponse.setArea(new BigDecimal("55.5"));
        propertyResponse.setCity("Warszawa");
        propertyResponse.setStreet("Marszałkowska");
        propertyResponse.setPostalCode("00-624");
        propertyResponse.setNumberOfRooms(3);
        propertyResponse.setFloor(4);
        propertyResponse.setTotalFloors(10);
        propertyResponse.setTransactionType("SPRZEDAŻ");
        propertyResponse.setPropertyType("MIESZKANIE");
        propertyResponse.setStatus("ACTIVE");
        propertyResponse.setOwner(owner);

        when(propertyService.getById(1L))
                .thenReturn(propertyResponse);

        mockMvc.perform(get("/api/properties/1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Piękne mieszkanie w Warszawie")))
                .andExpect(jsonPath("$.price", is(650000)))
                .andExpect(jsonPath("$.area", is(55.5)))
                .andExpect(jsonPath("$.city", is("Warszawa")))
                .andExpect(jsonPath("$.status", is("ACTIVE")))
                .andExpect(jsonPath("$.owner.id", is(10)))
                .andExpect(jsonPath("$.owner.firstName", is("Jan")))
                .andExpect(jsonPath("$.owner.lastName", is("Kowalski")));
    }

    @Test
    @WithMockUser
    void getById_ShouldReturn404_WhenPropertyNotFound() throws Exception {
        //GIVEN
        when(propertyService.getById(999L))
                .thenThrow(new RuntimeException("Property not found"));

        //WHEN & THEN
        mockMvc.perform(get("/api/properties/999"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}
