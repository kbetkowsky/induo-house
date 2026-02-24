package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.PageResponse;
import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.request.UpdatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyImageResponse;
import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.service.FileStorageService;
import com.induohouse.induo_house.service.PropertyService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.io.IOException;
import java.math.BigDecimal;

@Tag(name = "Properties", description = "Zarządzanie ogłoszeniami nieruchomości")
@SecurityRequirement(name = "cookieAuth")
@Slf4j
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;

    public PropertyController(PropertyService propertyService, FileStorageService fileStorageService) {
        this.propertyService = propertyService;
        this.fileStorageService = fileStorageService;
    }

    @Operation(summary = "Wyszukaj nieruchomości", description = "Filtruje po mieście i typie")
    @GetMapping("/search")
    public ResponseEntity<Page<PropertyListResponse>> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            Pageable pageable
    ) {
        return ResponseEntity.ok(propertyService.search(city, propertyType, pageable));
    }

    @Operation(summary = "Pobierz wszystkie nieruchomości", description = "Zwraca paginowaną listę nieruchomości")
    @GetMapping
    public ResponseEntity<PageResponse<PropertyListResponse>> getAll(Pageable pageable) {
        log.info("Get all properties - page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<PropertyListResponse> propertiesPage = propertyService.getAll(pageable);
        return ResponseEntity.ok(PageResponse.of(propertiesPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getById(id));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<Page<PropertyListResponse>> getByCity(
            @PathVariable String city,
            Pageable pageable
    ) {
        return ResponseEntity.ok(propertyService.getByCity(city, pageable));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<PropertyListResponse>> getByType(
            @PathVariable String type,
            Pageable pageable
    ) {
        return ResponseEntity.ok(propertyService.getByType(type, pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PropertyListResponse>> getByUserId(
            @PathVariable Long userId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(propertyService.getByUserId(userId, pageable));
    }

    @GetMapping("/price-range")
    public ResponseEntity<Page<PropertyListResponse>> getByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @PageableDefault(size = 20, sort = "price", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        return ResponseEntity.ok(propertyService.getByPriceRange(minPrice, maxPrice, pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<PropertyListResponse>> getMyProperties(
            Authentication authentication,
            Pageable pageable
    ) {
        User currentUser = (User) authentication.getPrincipal();
        log.info("User {} fetching their properties", currentUser.getEmail());
        return ResponseEntity.ok(propertyService.getByUserId(currentUser.getId(), pageable));
    }

    @Operation(summary = "Utwórz nieruchomość")
    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody CreatePropertyRequest request,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        log.info("User {} creating new property: {}", currentUser.getEmail(), request.getTitle());
        PropertyResponse response = propertyService.create(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PropertyResponse> patchProperty(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePropertyRequest request,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(propertyService.updatePatch(request, id, currentUser.getId()));
    }

    @Operation(summary = "Usuń nieruchomość")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        propertyService.delete(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<PropertyImageResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary,
            Authentication authentication
    ) throws IOException {
        User currentUser = (User) authentication.getPrincipal();
        PropertyImageResponse response = propertyService.addImage(id, file, isPrimary, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{propertyId}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId,
            Authentication authentication
    ) throws IOException {
        User currentUser = (User) authentication.getPrincipal();
        propertyService.deleteImage(propertyId, imageId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
