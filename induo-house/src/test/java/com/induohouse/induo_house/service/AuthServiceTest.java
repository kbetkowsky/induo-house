package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.auth.AuthResponse;
import com.induohouse.induo_house.dto.auth.LoginRequest;
import com.induohouse.induo_house.dto.auth.RegisterRequest;
import com.induohouse.induo_house.dto.user.UserDto;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.exception.EmailAlreadyExistsException;
import com.induohouse.induo_house.exception.UnauthorizedException;
import com.induohouse.induo_house.repository.UserRepository;
import com.induohouse.induo_house.security.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void register_ShouldReturnToken_WhenEmailIsNew() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("nowy@test.com");
        req.setPassword("haslo");
        req.setFirstName("Anna");
        req.setLastName("Nowak");

        User saved = new User();
        saved.setId(1L);
        saved.setEmail("nowy@test.com");

        when(userRepository.existsByEmail("nowy@test.com")).thenReturn(false);
        when(passwordEncoder.encode("haslo")).thenReturn("$hashed$");
        when(userRepository.save(any(User.class))).thenReturn(saved);
        when(jwtService.generateToken(saved)).thenReturn("token");
        when(jwtService.generateRefreshToken(saved)).thenReturn("refresh");

        AuthResponse result = authService.register(req);

        assertEquals("nowy@test.com", result.getEmail());
        assertEquals("token", result.getToken());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ShouldThrow_WhenEmailTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("zajety@test.com");
        req.setPassword("haslo");

        when(userRepository.existsByEmail("zajety@test.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsValid() {
        LoginRequest req = new LoginRequest();
        req.setEmail("jan@test.com");
        req.setPassword("haslo");

        User user = new User();
        user.setId(1L);
        user.setEmail("jan@test.com");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(Authentication.class));
        when(userRepository.findByEmail("jan@test.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("token");
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh");

        AuthResponse result = authService.login(req);

        assertEquals("jan@test.com", result.getEmail());
        assertEquals("token", result.getToken());
    }

    @Test
    void login_ShouldThrow_WhenBadCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("jan@test.com");
        req.setPassword("zle");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void getCurrentUser_ShouldReturnDto_WhenAuthenticated() {
        User user = new User();
        user.setId(1L);
        user.setEmail("jan@test.com");
        user.setFirstName("Jan");
        user.setLastName("Kowalski");

        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn("jan@test.com");
        when(auth.getName()).thenReturn("jan@test.com");

        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);

        when(userRepository.findByEmail("jan@test.com")).thenReturn(Optional.of(user));

        UserDto result = authService.getCurrentUser();

        assertEquals("jan@test.com", result.getEmail());
        assertEquals("Jan", result.getFirstName());
    }

    @Test
    void getCurrentUser_ShouldThrow_WhenNoAuth() {
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(ctx);

        assertThrows(UnauthorizedException.class, () -> authService.getCurrentUser());
    }

    @Test
    void getCurrentUser_ShouldThrow_WhenAnonymous() {
        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn("anonymousUser");

        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);

        assertThrows(UnauthorizedException.class, () -> authService.getCurrentUser());
    }
}
