package com.example.backend.service;

import com.example.backend.entity.Meal;
import com.example.backend.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;



@Service
public class MealService {

    @Autowired
    private MealRepository mealRepo;

    // 🔥 CURRENT MEAL
    public String getCurrentMeal() {
        LocalTime now = LocalTime.now();

        if (now.isBefore(LocalTime.of(10, 30))) return "Breakfast";
        else if (now.isBefore(LocalTime.of(16, 0))) return "Lunch";
        else return "Dinner";
    }

    public long getTodayEatingCount(String mealType, String messNo) {

        LocalDate today = LocalDate.now();

        List<Meal> meals = mealRepo.findByDateAndUser_MessNo(today, messNo);

        // 🔹 function to count
        java.util.function.Function<String, Long> countFn = (meal) ->
                meals.stream()
                        .filter(m -> m.getMealType() != null &&
                                m.getMealType().equalsIgnoreCase(meal))
                        .filter(m -> m.getStatus() != null &&
                                (m.getStatus().equalsIgnoreCase("Eating") ||
                                        m.getStatus().equalsIgnoreCase("EATEN")))
                        .map(m -> m.getUser().getId())
                        .distinct()
                        .count();

        long count = countFn.apply(mealType);

        // 🔥 FALLBACK LOGIC
        if (count == 0) {

            System.out.println("No data for " + mealType + ", checking fallback...");

            if (mealType.equals("Lunch")) {
                count = countFn.apply("Breakfast");
                mealType = "Breakfast";
            }
            else if (mealType.equals("Dinner")) {
                count = countFn.apply("Lunch");
                if (count == 0) {
                    count = countFn.apply("Breakfast");
                    mealType = "Breakfast";
                } else {
                    mealType = "Lunch";
                }
            }
        }

        System.out.println("Final Meal Used: " + mealType);
        System.out.println("Final Count: " + count);

        return count;
    }

    public double getFoodRequiredKg(long count) {
        return Math.ceil(count / 4.0);
    }
}