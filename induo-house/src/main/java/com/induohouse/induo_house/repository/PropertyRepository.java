package com.induohouse.induo_house.repository;

import com.induohouse.induo_house.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

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

    @EntityGraph(attributePaths = {"images", "user"})
    @Query("SELECT p FROM Property p ORDER BY p.createdAt DESC")
    Page<Property> findAllPaged(Pageable pageable);

    @EntityGraph(attributePaths = {"images", "user"})
    @Query("SELECT p FROM Property p WHERE p.id IN :ids")
    List<Property> findAllWithImagesByIds(@Param("ids") List<Long> ids);

    @EntityGraph(attributePaths = {"images", "user"})
    @Query("SELECT p FROM Property p WHERE p.id = :id")
    Optional<Property> findByIdWithImages(@Param("id") Long id);

    @EntityGraph(attributePaths = {"images", "user"})
    @Query("SELECT p FROM Property p WHERE p.propertyType = :type")
    Page<Property> findByPropertyTypeWithDetails(
            @Param("type") String type, Pageable pageable
    );

    @EntityGraph(attributePaths = {"images", "user"})
    @Query("SELECT p FROM Property p ORDER BY p.createdAt DESC")
    Page<Property> findAllWithDetails(Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.city = :city AND CAST(p.propertyType AS string) = :propertyType")
    Page<Property> findByCityAndPropertyType(
            @Param("city") String city,
            @Param("propertyType") String propertyType,
            Pageable pageable
    );

    @Query(value = """
        SELECT * FROM properties p
        WHERE (:city        IS NULL OR p.city             ILIKE '%' || :city || '%')
          AND (:propertyType    IS NULL OR p.property_type    = :propertyType)
          AND (:transactionType IS NULL OR p.transaction_type = :transactionType)
          AND (:minPrice    IS NULL OR p.price  >= :minPrice)
          AND (:maxPrice    IS NULL OR p.price  <= :maxPrice)
          AND (:minArea     IS NULL OR p.area   >= :minArea)
          AND (:maxArea     IS NULL OR p.area   <= :maxArea)
          AND (:bedrooms    IS NULL OR p.number_of_rooms >= :bedrooms)
        ORDER BY p.created_at DESC
        """,
            countQuery = """
        SELECT COUNT(*) FROM properties p
        WHERE (:city        IS NULL OR p.city             ILIKE '%' || :city || '%')
          AND (:propertyType    IS NULL OR p.property_type    = :propertyType)
          AND (:transactionType IS NULL OR p.transaction_type = :transactionType)
          AND (:minPrice    IS NULL OR p.price  >= :minPrice)
          AND (:maxPrice    IS NULL OR p.price  <= :maxPrice)
          AND (:minArea     IS NULL OR p.area   >= :minArea)
          AND (:maxArea     IS NULL OR p.area   <= :maxArea)
          AND (:bedrooms    IS NULL OR p.number_of_rooms >= :bedrooms)
        """,
            nativeQuery = true)
    Page<Property> findWithFilters(
            @Param("city")            String city,
            @Param("propertyType")    String propertyType,
            @Param("transactionType") String transactionType,
            @Param("minPrice")        BigDecimal minPrice,
            @Param("maxPrice")        BigDecimal maxPrice,
            @Param("minArea")         BigDecimal minArea,
            @Param("maxArea")         BigDecimal maxArea,
            @Param("bedrooms")        Integer bedrooms,
            Pageable pageable
    );
}
