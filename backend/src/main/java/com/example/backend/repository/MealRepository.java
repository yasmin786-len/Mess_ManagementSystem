package com.example.backend.repository;

import com.example.backend.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MealRepository extends JpaRepository<Meal, Long> {

    // ✅ All meals of user
    List<Meal> findByUserId(Long userId);
    List<Meal> findByDate(LocalDate date);

    // ✅ For calendar
    List<Meal> findByUserIdAndDate(Long userId, LocalDate date);

    // ✅ Duplicate check
    Optional<Meal> findByUserIdAndMealTypeAndDate(
            Long userId,
            String mealType,
            LocalDate date
    );

    // ✅ Monthly filtering
    List<Meal> findByUserIdAndDateBetween(
            Long userId,
            LocalDate start,
            LocalDate end
    );

    List<Meal> findByDateAndUser_MessNo(LocalDate date, String messNo);
}