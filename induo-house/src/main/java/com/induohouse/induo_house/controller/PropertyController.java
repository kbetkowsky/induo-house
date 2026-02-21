package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.PageResponse;
import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.request.UpdatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyImageResponse;
import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.service.FileStorageService;
import com.induohouse.induo_house.service.PropertyService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/api/properties/search")
    public ResponseEntity<Page<PropertyListResponse>> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            Pageable pageable
    ) {
        return ResponseEntity.ok(propertyService.search(city, propertyType, pageable));
    }

    @GetMapping("{id}")
    public ResponseEntity<PropertyResponse> getById(@PathVariable Long id) {
        try {
            PropertyResponse response = propertyService.getById(id);
        return ResponseEntity.ok(response); }
        catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<PageResponse<PropertyListResponse>> getAll(Pageable pageable) {
        log.info("Get all properties - page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());

        Page<PropertyListResponse> propertiesPage = propertyService.getAll(pageable);
        PageResponse<PropertyListResponse> response = PageResponse.of(propertiesPage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<Page<PropertyListResponse>> getByCity(
            @PathVariable String city,
            Pageable pageable
    ) {
        Page<PropertyListResponse> pageresponse = propertyService.getByCity(city, pageable);
        return ResponseEntity.ok(pageresponse);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PropertyListResponse>> getPropertiesByUserId(
            @PathVariable Long userId,
            Pageable pageable
    ) {
        Page<PropertyListResponse> responses = propertyService.getByUserId(userId, pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<PropertyListResponse>> getByType(
            @PathVariable String type,
            Pageable pageable
    ) {
        Page<PropertyListResponse> responses = propertyService.getByType(type, pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/price-range")
    public ResponseEntity<Page<PropertyListResponse>> getByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @PageableDefault(size = 20, sort = "price", direction = Sort.Direction.ASC)
            Pageable pageable
            ) {
        Page<PropertyListResponse> responses = propertyService.getByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<PropertyListResponse>> getMyProperties(
            Authentication authentication,
            Pageable pageable
    ) {
        User currentUser = (User) authentication.getPrincipal();  // ← Cast
        log.info("User {} fetching their properties", currentUser.getEmail());
        Page<PropertyListResponse> response = propertyService.getByUserId(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

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
        PropertyResponse response = propertyService.updatePatch(request, id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            propertyService.delete(id, currentUser.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Delete failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
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
