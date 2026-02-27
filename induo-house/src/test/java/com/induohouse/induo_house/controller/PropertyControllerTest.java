package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyOwnerResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.exception.PropertyAccessDeniedException;
import com.induohouse.induo_house.exception.PropertyNotFoundException;
import com.induohouse.induo_house.security.JwtService;
import com.induohouse.induo_house.service.FileStorageService;
import com.induohouse.induo_house.service.PropertyService;
import org.junit.jupiter.api.Test;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class PropertyControllerTest {

    @Autowired
    WebApplicationContext context;

    @MockitoBean PropertyService propertyService;
    @MockitoBean FileStorageService fileStorageService;
    @MockitoBean JwtService jwtService;

    private MockMvc mockMvc() {
        return MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    private UsernamePasswordAuthenticationToken userAuth(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setPasswordHash("hash");
        user.setRole(User.Role.USER);
        return new UsernamePasswordAuthenticationToken(user, null, List.of());
    }

    @Test
    void getById_ShouldReturn200_WhenPropertyExists() throws Exception {
        PropertyOwnerResponse owner = new PropertyOwnerResponse();
        owner.setId(10L);
        owner.setFirstName("Jan");
        owner.setLastName("Kowalski");
        owner.setEmail("jan@example.com");
        owner.setPhoneNumber("123456789");

        PropertyResponse response = new PropertyResponse();
        response.setId(1L);
        response.setTitle("Piękne mieszkanie");
        response.setPrice(new BigDecimal("650000"));
        response.setCity("Warszawa");
        response.setOwner(owner);

        when(propertyService.getById(1L)).thenReturn(response);

        mockMvc().perform(get("/api/properties/1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Piękne mieszkanie")))
                .andExpect(jsonPath("$.city", is("Warszawa")))
                .andExpect(jsonPath("$.owner.firstName", is("Jan")));
    }

    @Test
    void getById_ShouldReturn404_WhenPropertyNotFound() throws Exception {
        when(propertyService.getById(999L))
                .thenThrow(new PropertyNotFoundException(999L));

        mockMvc().perform(get("/api/properties/999"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void getAll_ShouldReturn200WithPageContent() throws Exception {
        PropertyListResponse item = new PropertyListResponse();
        item.setId(1L);
        item.setTitle("Mieszkanie na wynajem");
        item.setCity("Kraków");
        item.setPrice(new BigDecimal("3000"));

        PageImpl<PropertyListResponse> page =
                new PageImpl<>(List.of(item), PageRequest.of(0, 20), 1);

        when(propertyService.getAll(any())).thenReturn(page);

        mockMvc().perform(get("/api/properties"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title", is("Mieszkanie na wynajem")))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    void createProperty_ShouldReturn201_WhenUserAuthenticated() throws Exception {
        PropertyResponse createdResponse = new PropertyResponse();
        createdResponse.setId(99L);
        createdResponse.setTitle("Nowe mieszkanie");
        createdResponse.setPrice(new BigDecimal("600000"));
        createdResponse.setCity("Kraków");
        createdResponse.setStatus("ACTIVE");

        when(propertyService.create(any(), eq(1L))).thenReturn(createdResponse);

        String requestBody = """
                {
                    "title": "Nowe mieszkanie",
                    "description": "Opis",
                    "price": 600000,
                    "area": 65,
                    "city": "Kraków",
                    "street": "Floriańska 5",
                    "postalCode": "31-000",
                    "numberOfRooms": 3,
                    "floor": 2,
                    "totalFloors": 8,
                    "transactionType": "SALE",
                    "propertyType": "APARTMENT",
                    "imageUrl": "https://example.com/photo.jpg"
                }
                """;

        mockMvc().perform(post("/api/properties")
                        .with(authentication(userAuth(1L, "jan@test.com")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(99)))
                .andExpect(jsonPath("$.title", is("Nowe mieszkanie")))
                .andExpect(jsonPath("$.city", is("Kraków")))
                .andExpect(jsonPath("$.status", is("ACTIVE")));
    }


    @Test
    void deleteProperty_ShouldReturn204_WhenUserIsOwner() throws Exception {
        User fakeUser = new User();
        fakeUser.setId(1L);
        fakeUser.setEmail("jan@test.com");
        fakeUser.setPasswordHash("hash");
        fakeUser.setRole(User.Role.USER);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(fakeUser, null, List.of());

        mockMvc().perform(delete("/api/properties/1")
                        .with(authentication(auth)))
                .andDo(print())
                .andExpect(status().isNoContent());
    }


    @Test
    void deleteProperty_ShouldReturn403_WhenUserIsNotOwner() throws Exception {
        User fakeUser = new User();
        fakeUser.setId(99L);
        fakeUser.setEmail("obcy@test.com");
        fakeUser.setPasswordHash("hash");
        fakeUser.setRole(User.Role.USER);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(fakeUser, null, List.of());

        org.mockito.Mockito.doThrow(new PropertyAccessDeniedException())
                .when(propertyService).delete(any(), any());

        mockMvc().perform(delete("/api/properties/1")
                        .with(authentication(auth)))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

}
