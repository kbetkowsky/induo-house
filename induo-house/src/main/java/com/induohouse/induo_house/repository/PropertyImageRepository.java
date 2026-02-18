package com.induohouse.induo_house.repository;

import com.induohouse.induo_house.entity.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    List<PropertyImage> findByPropertyIdOrderBySortOrderAsc(Long propertyId);

    @Modifying
    @Query("UPDATE PropertyImage i SET i.isPrimary = false WHERE i.property.id = :propertyId")
    void clearPrimaryForProperty(Long propertyId);
}
