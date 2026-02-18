package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.auth.AuthResponse;
import com.induohouse.induo_house.dto.auth.LoginRequest;
import com.induohouse.induo_house.dto.auth.RegisterRequest;
import com.induohouse.induo_house.dto.user.UserDto;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.exception.EmailAlreadyExistsException;
import com.induohouse.induo_house.exception.UnauthorizedException;
import com.induohouse.induo_house.exception.UserNotFoundException;
import com.induohouse.induo_house.repository.UserRepository;
import com.induohouse.induo_house.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: email already exists - {}", request.getEmail());
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(User.Role.USER)
                .isEmailVerified(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {} with ID: {}", savedUser.getEmail(), savedUser.getId());

        String jwtToken = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            log.error("Authentication failed for {}: {}", request.getEmail(), e.getMessage());
            throw e;
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("User not found after authentication: {}", request.getEmail());
                    return new UserNotFoundException("User not found");
                });
        log.info("User authenticated successfully: email={}, role={}", user.getEmail(), user.getRole());

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        log.info("Login successful for user: {}", user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .build();
    }

    public UserDto getCurrentUser() {
        log.debug("Getting current user from Security Context");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            log.error("User not authenticated - no valid security context");
            throw new UnauthorizedException("User not authenticated");
        }

        String email = authentication.getName();
        log.debug("Current authenticated user email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found in database: {}", email);
                    return new UserNotFoundException("User not found: " + email);
                });

        log.info("Successfully retrieved user data: id={}, email={}", user.getId(), user.getEmail());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
