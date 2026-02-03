package com.induohouse.induo_house.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePropertyRequest {

    @NotBlank(message = "Tytuł jest wymagany")
    @Size(max = 255, message = "Tytuł może mieć maksymalnie 255 znaków")
    private String title;

    @Size(max = 2000, message = "Opis może mieć maksymalnie 2000 znaków")
    private String description;

    @NotNull(message = "Cena jest wymagana")
    @DecimalMin(value = "0.01", message = "Cena musi być większa od 0")
    @Digits(integer = 10, fraction = 2, message = "Cena: max 10 cyfr całkowitych, 2 po przecinku")
    private BigDecimal price;

    @DecimalMin(value = "0.01", message = "Powierzchnia musi być większa od 0")
    @Digits(integer = 6, fraction = 2, message = "Powierzchnia: max 6 cyfr całkowitych, 2 po przecinku")
    private BigDecimal area;

    @NotBlank(message = "Miasto jest wymagane")
    @Size(max = 100, message = "Miasto może mieć maksymalnie 100 znaków")
    private String city;

    @Size(max = 255, message = "Ulica może mieć maksymalnie 255 znaków")
    private String street;

    @Size(max = 10, message = "Kod pocztowy może mieć maksymalnie 10 znaków")
    @Pattern(regexp = "^\\d{2}-\\d{3}$", message = "Nieprawidłowy format kodu pocztowego (XX-XXX)")
    private String postalCode;

    @Min(value = 1, message = "Liczba pokoi musi być większa od 0")
    @Max(value = 50, message = "Liczba pokoi nie może być większa niż 50")
    private Integer numberOfRooms;

    @Min(value = -2, message = "Piętro nie może być mniejsze niż -2")
    @Max(value = 100, message = "Piętro nie może być większe niż 100")
    private Integer floor;

    @Min(value = 1, message = "Liczba pięter musi być większa od 0")
    @Max(value = 100, message = "Liczba pięter nie może być większa niż 100")
    private Integer totalFloors;

    @NotBlank(message = "Typ transakcji jest wymagany")
    @Pattern(regexp = "SALE|RENT", message = "Typ transakcji musi być SALE lub RENT")
    private String transactionType;

    @NotBlank(message = "Typ nieruchomości jest wymagany")
    @Pattern(regexp = "APARTMENT|HOUSE|LAND", message = "Typ nieruchomości: APARTMENT, HOUSE lub LAND")
    private String propertyType;

}
