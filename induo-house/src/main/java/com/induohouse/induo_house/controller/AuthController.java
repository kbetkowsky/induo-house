package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.auth.AuthResponse;
import com.induohouse.induo_house.dto.auth.LoginRequest;
import com.induohouse.induo_house.dto.auth.RegisterRequest;
import com.induohouse.induo_house.dto.user.UserDto;
import com.induohouse.induo_house.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication", description = "Rejestracja, logowanie i wylogowanie")
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${jwt.cookie.name:auth_token}")
    private String cookieName;

    @Value("${jwt.cookie.max-age:604800}")
    private int cookieMaxAge;

    @Value("${jwt.cookie.secure:false}")
    private boolean cookieSecure;

    @Operation(summary = "Zarejestruj nowego użytkownika")
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        log.info("Registration request for email: {}", request.getEmail());

        AuthResponse authResponse = authService.register(request);

        addAuthCookie(response, authResponse.getToken());

        UserDto userDto = convertToUserDto(authResponse);

        log.info("User registered successfully with httpOnly cookie: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }

    @Operation(summary = "Zaloguj się")
    @PostMapping("/login")
    public ResponseEntity<UserDto> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.info("Login request for email: {}", request.getEmail());

        AuthResponse authResponse = authService.login(request);

        addAuthCookie(response, authResponse.getToken());

        UserDto userDto = convertToUserDto(authResponse);

        log.info("User logged in successfully with httpOnly cookie: {}", request.getEmail());
        return ResponseEntity.ok(userDto);
    }

    @Operation(summary = "Wyloguj się - czyści cookie")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        log.info("Logout request - clearing auth cookie");

        Cookie cookie = new Cookie(cookieName, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        log.info("Auth cookie cleared successfully");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        log.info("Get current user request");

        UserDto user = authService.getCurrentUser();

        return ResponseEntity.ok(user);
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(cookieName, token);

        cookie.setHttpOnly(true);

        cookie.setSecure(cookieSecure);

        cookie.setPath("/");

        cookie.setMaxAge(cookieMaxAge);

        cookie.setAttribute("SameSite", "Lax");

        response.addCookie(cookie);

        log.debug("Auth cookie added: name={}, maxAge={}, secure={}, httpOnly=true",
                cookieName, cookieMaxAge, cookieSecure);
    }

    private UserDto convertToUserDto(AuthResponse authResponse) {
        return UserDto.builder()
                .email(authResponse.getEmail())
                .build();
    }
}
