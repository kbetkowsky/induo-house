package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.request.CreatePropertyRequest;
import com.induohouse.induo_house.dto.request.UpdatePropertyRequest;
import com.induohouse.induo_house.dto.response.PropertyImageResponse;
import com.induohouse.induo_house.dto.response.PropertyListResponse;
import com.induohouse.induo_house.dto.response.PropertyResponse;
import com.induohouse.induo_house.entity.Property;
import com.induohouse.induo_house.entity.PropertyImage;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.exception.PropertyAccessDeniedException;
import com.induohouse.induo_house.exception.PropertyNotFoundException;
import com.induohouse.induo_house.exception.UserNotFoundException;
import com.induohouse.induo_house.mapper.PropertyMapper;
import com.induohouse.induo_house.repository.PropertyImageRepository;
import com.induohouse.induo_house.repository.PropertyRepository;
import com.induohouse.induo_house.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyMapper propertyMapper;
    private final PropertyImageRepository propertyImageRepository;
    private final FileStorageService fileStorageService;

    public PropertyService(PropertyRepository propertyRepository,
                           UserRepository userRepository,
                           PropertyMapper propertyMapper,
                           PropertyImageRepository propertyImageRepository,
                           FileStorageService fileStorageService) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyMapper = propertyMapper;
        this.propertyImageRepository = propertyImageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public Page<PropertyListResponse> getAll(Pageable pageable) {
        Page<Property> page = propertyRepository.findAllPaged(pageable);

        List<Long> ids = page.getContent().stream()
                .map(Property::getId).toList();

        List<Property> fullProperties = propertyRepository.findAllWithImagesByIds(ids);

        Map<Long, Property> propertyMap = fullProperties.stream()
                .collect(Collectors.toMap(Property::getId, p -> p));

        List<PropertyListResponse> responses = page.getContent().stream()
                .map(p -> propertyMapper.toListResponse(propertyMap.get(p.getId())))
                .toList();

        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public PropertyResponse getById(Long id) {
        Property property = propertyRepository.findByIdWithImages(id)
                .orElseThrow(() -> new PropertyNotFoundException(id));
        return propertyMapper.toResponse(property);
    }

    private Pageable toNativePageable(Pageable pageable) {
        Sort convertedSort = Sort.by(
                pageable.getSort().stream()
                        .map(order -> {
                            String snakeCase = order.getProperty()
                                    .replaceAll("([A-Z])", "_$1")
                                    .toLowerCase();
                            return order.isAscending()
                                    ? Sort.Order.asc(snakeCase)
                                    : Sort.Order.desc(snakeCase);
                        })
                        .toList()
        );
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), convertedSort);
    }

    @Transactional(readOnly = true)
    public Page<PropertyListResponse> search(
            String city,
            String propertyType,
            String transactionType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minArea,
            BigDecimal maxArea,
            Integer bedrooms,
            Pageable pageable) {

        String cityParam = (city != null && !city.isBlank())                       ? city            : null;
        String typeParam = (propertyType != null && !propertyType.isBlank())       ? propertyType    : null;
        String txParam   = (transactionType != null && !transactionType.isBlank()) ? transactionType : null;

        Pageable nativePageable = toNativePageable(pageable);

        Page<Property> page = propertyRepository.findWithFilters(
                cityParam, typeParam, txParam,
                minPrice, maxPrice, minArea, maxArea, bedrooms,
                nativePageable);

        if (page.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<Long> ids = page.getContent().stream().map(Property::getId).toList();
        List<Property> fullProperties = propertyRepository.findAllWithImagesByIds(ids);
        Map<Long, Property> propertyMap = fullProperties.stream()
                .collect(Collectors.toMap(Property::getId, p -> p));

        List<PropertyListResponse> responses = page.getContent().stream()
                .map(p -> propertyMapper.toListResponse(
                        propertyMap.getOrDefault(p.getId(), p)))
                .toList();

        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    public Page<PropertyListResponse> getByCity(String city, Pageable pageable) {
        return propertyRepository.findByCity(city, pageable)
                .map(propertyMapper::toListResponse);
    }

    public Page<PropertyListResponse> getByType(String propertyType, Pageable pageable) {
        return propertyRepository.findByPropertyTypeWithDetails(propertyType, pageable)
                .map(propertyMapper::toListResponse);
    }

    public Page<PropertyListResponse> getByUserId(Long userId, Pageable pageable) {
        return propertyRepository.findByUserId(userId, pageable)
                .map(propertyMapper::toListResponse);
    }

    public Page<PropertyListResponse> getByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return propertyRepository.findByPriceBetween(minPrice, maxPrice, pageable)
                .map(propertyMapper::toListResponse);
    }

    @Transactional
    public PropertyResponse create(CreatePropertyRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Property property = propertyMapper.toEntity(request);
        property.setUser(user);
        Property saved = propertyRepository.save(property);
        return propertyMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long propertyId, Long userId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId));

        if (!property.getUser().getId().equals(userId)) {
            throw new PropertyAccessDeniedException();
        }

        propertyRepository.delete(property);
        log.info("Property {} deleted by user {}", propertyId, userId);
    }

    @Transactional
    public PropertyResponse updatePatch(UpdatePropertyRequest request, Long propertyId, Long userId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId));

        if (!property.getUser().getId().equals(userId)) {
            throw new PropertyAccessDeniedException();
        }

        if (request.getTitle() != null)           property.setTitle(request.getTitle());
        if (request.getDescription() != null)     property.setDescription(request.getDescription());
        if (request.getPrice() != null)           property.setPrice(request.getPrice());
        if (request.getArea() != null)            property.setArea(request.getArea());
        if (request.getCity() != null)            property.setCity(request.getCity());
        if (request.getStreet() != null)          property.setStreet(request.getStreet());
        if (request.getPostalCode() != null)      property.setPostalCode(request.getPostalCode());
        if (request.getNumberOfRooms() != null)   property.setNumberOfRooms(request.getNumberOfRooms());
        if (request.getFloor() != null)           property.setFloor(request.getFloor());
        if (request.getTotalFloors() != null)     property.setTotalFloors(request.getTotalFloors());
        if (request.getTransactionType() != null) property.setTransactionType(request.getTransactionType());
        if (request.getPropertyType() != null)    property.setPropertyType(request.getPropertyType());

        Property saved = propertyRepository.save(property);
        return propertyMapper.toResponse(saved);
    }

    @Transactional
    public PropertyImageResponse addImage(Long propertyId, MultipartFile file,
                                          boolean isPrimary, Long userId) throws IOException {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId));

        if (!property.getUser().getId().equals(userId)) {
            throw new PropertyAccessDeniedException();
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Dozwolone są tylko pliki graficzne (jpg, png, webp)");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Plik nie może być większy niż 5MB");
        }

        if (isPrimary || property.getImages().isEmpty()) {
            propertyImageRepository.clearPrimaryForProperty(propertyId);
        }

        String url = fileStorageService.uploadFile(file);
        int sortOrder = property.getImages().size();

        PropertyImage image = new PropertyImage();
        image.setProperty(property);
        image.setUrl(url);
        image.setPrimary(isPrimary || sortOrder == 0);
        image.setSortOrder(sortOrder);

        PropertyImage saved = propertyImageRepository.save(image);
        log.info("Image added to property {} by user {}, isPrimary={}", propertyId, userId, image.isPrimary());

        PropertyImageResponse response = new PropertyImageResponse();
        response.setId(saved.getId());
        response.setUrl(saved.getUrl());
        response.setPrimary(saved.isPrimary());
        response.setSortOrder(saved.getSortOrder());
        return response;
    }

    @Transactional
    public void deleteImage(Long propertyId, Long imageId, Long userId) throws IOException {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId));

        if (!property.getUser().getId().equals(userId)) {
            throw new PropertyAccessDeniedException();
        }

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new PropertyNotFoundException(imageId));

        if (!image.getProperty().getId().equals(propertyId)) {
            throw new PropertyAccessDeniedException();
        }

        fileStorageService.deleteFile(image.getUrl());
        propertyImageRepository.delete(image);
        log.info("Image {} deleted from property {} by user {}", imageId, propertyId, userId);

        if (image.isPrimary()) {
            propertyImageRepository.findByPropertyIdOrderBySortOrderAsc(propertyId)
                    .stream()
                    .findFirst()
                    .ifPresent(first -> {
                        first.setPrimary(true);
                        propertyImageRepository.save(first);
                    });
        }
    }
}
