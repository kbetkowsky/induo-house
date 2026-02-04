package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.request.UpdatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.service.FileStorageService;
import com.induohouse.induo_house.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;

    public PropertyController(PropertyService propertyService, FileStorageService fileStorageService) {
        this.propertyService = propertyService;
        this.fileStorageService = fileStorageService;
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
    public ResponseEntity<Page<PropertyListResponse>> getAll(Pageable pageable) {
        Page<PropertyListResponse> response = propertyService.getAll(pageable);
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

    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = fileStorageService.uploadFile(file);
            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("create-property")
    public ResponseEntity<PropertyResponse> createProperty(@RequestBody @Valid CreatePropertyRequest request, Long userId) {
        PropertyResponse propertyResponse = propertyService.create(request, userId);
        return ResponseEntity.status(201).body(propertyResponse);
    }




}
