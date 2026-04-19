package com.example.backend.repository;

import com.example.backend.entity.MealEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;


public interface MealEntryRepository extends JpaRepository<MealEntry, Long> {

    List<MealEntry> findByMessNoAndDate(String messNo, LocalDate date);

    Optional<MealEntry> findByMessNoAndMealTypeAndDate(
            String messNo,
            String mealType,
            LocalDate date
    );
}