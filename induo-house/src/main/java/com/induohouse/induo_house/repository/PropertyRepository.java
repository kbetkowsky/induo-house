package com.induohouse.induo_house.repository;

import com.induohouse.induo_house.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByCity(String city);
    List<Property> findByPrice(BigDecimal price);
    List<Property> findByUserId(Long userId);

    Page<Property> findByCity(String city, Pageable pageable);
    Page<Property> findByUserId(Long userId, Pageable pageable);
    Page<Property> findByPropertyType(String propertyType, Pageable pageable);
    Page<Property> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    Page<Property> findByAreaGreaterThanEqual(BigDecimal minArea, Pageable pageable);
    Page<Property> findByCityAndPropertyType(String city, String propertyType, Pageable pageable);

}
