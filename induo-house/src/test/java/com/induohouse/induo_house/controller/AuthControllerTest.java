package com.induohouse.induo_house.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.induohouse.induo_house.dto.auth.AuthResponse;
import com.induohouse.induo_house.dto.auth.LoginRequest;
import com.induohouse.induo_house.dto.auth.RegisterRequest;
import com.induohouse.induo_house.dto.user.UserDto;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.exception.EmailAlreadyExistsException;
import com.induohouse.induo_house.exception.UnauthorizedException;
import com.induohouse.induo_house.security.JwtService;
import com.induohouse.induo_house.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class AuthControllerTest {

    @Autowired
    WebApplicationContext context;

    @MockitoBean
    AuthService authService;

    @MockitoBean
    JwtService jwtService;

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
    void register_ShouldReturn201AndSetCookie_WhenValidData() throws Exception {
        AuthResponse authResponse = AuthResponse.builder()
                .email("jan@test.com")
                .token("jwt-token")
                .build();

        when(authService.register(any())).thenReturn(authResponse);

        String body = """
                {
                    "email": "jan@test.com",
                    "password": "haslo123",
                    "firstName": "Jan",
                    "lastName": "Kowalski"
                }
                """;

        mockMvc().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("jan@test.com"))
                .andExpect(cookie().exists("auth_token"));
    }

    @Test
    void register_ShouldReturn409_WhenEmailAlreadyTaken() throws Exception {
        when(authService.register(any()))
                .thenThrow(new EmailAlreadyExistsException("Email already exists"));

        String body = """
                {
                    "email": "zajety@test.com",
                    "password": "haslo123",
                    "firstName": "Jan",
                    "lastName": "Kowalski"
                }
                """;

        mockMvc().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isConflict());
    }

    @Test
    void login_ShouldReturn200AndSetCookie_WhenValidCredentials() throws Exception {
        AuthResponse authResponse = AuthResponse.builder()
                .email("jan@test.com")
                .token("jwt-token")
                .build();

        when(authService.login(any())).thenReturn(authResponse);

        String body = """
                {
                    "email": "jan@test.com",
                    "password": "haslo123"
                }
                """;

        mockMvc().perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("jan@test.com"))
                .andExpect(cookie().exists("auth_token"));
    }

    @Test
    void login_ShouldReturn401_WhenBadCredentials() throws Exception {
        when(authService.login(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        String body = """
                {
                    "email": "jan@test.com",
                    "password": "zle-haslo"
                }
                """;

        mockMvc().perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logout_ShouldReturn200AndClearCookie() throws Exception {
        mockMvc().perform(post("/api/auth/logout"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("auth_token", 0));
    }

    @Test
    void me_ShouldReturn200_WhenAuthenticated() throws Exception {
        UserDto userDto = UserDto.builder()
                .id(1L)
                .email("jan@test.com")
                .firstName("Jan")
                .lastName("Kowalski")
                .build();

        when(authService.getCurrentUser()).thenReturn(userDto);

        mockMvc().perform(get("/api/auth/me")
                        .with(authentication(userAuth(1L, "jan@test.com"))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("jan@test.com"))
                .andExpect(jsonPath("$.firstName").value("Jan"));
    }

    @Test
    void me_ShouldReturn401_WhenNotAuthenticated() throws Exception {
        mockMvc().perform(get("/api/auth/me"))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }
}
