package com.example.backend.controller;

import com.example.backend.entity.Meal;
import com.example.backend.entity.User;
import com.example.backend.repository.MealRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:5173")
public class MealController {

    @Autowired
    private MealRepository mealRepo;

    @Autowired
    private UserRepository userRepo;

    // ===============================
    // ✅ MARK MEAL
    // ===============================
    @PostMapping("/mark/{userId}")
    public Meal markMeal(@PathVariable Long userId, @RequestBody Meal meal) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (meal.getDate() == null) {
            meal.setDate(LocalDate.now());
        }

        meal.setMealType(meal.getMealType().trim());

        // 🔥 NORMALIZE STATUS (IMPORTANT FIX)
        String status = meal.getStatus().trim().toLowerCase();
        if (status.equals("eating")) {
            meal.setStatus("Eating");
        } else if (status.equals("skip")) {
            meal.setStatus("Skip");
        } else {
            throw new RuntimeException("Invalid status");
        }

        int hour = java.time.LocalTime.now().getHour();

        Map<String, Integer> deadlines = Map.of(
                "Breakfast", 9,
                "Lunch", 14,
                "Dinner", 21
        );

        Integer deadline = deadlines.get(meal.getMealType());

        if (meal.getStatus().equals("Skip") && hour >= deadline) {
            throw new RuntimeException("Skip time is over for " + meal.getMealType());
        }

        Optional<Meal> existing =
                mealRepo.findByUserIdAndMealTypeAndDate(
                        userId,
                        meal.getMealType(),
                        meal.getDate()
                );

        if (existing.isPresent()) {
            Meal m = existing.get();
            m.setStatus(meal.getStatus());
            return mealRepo.save(m);
        }

        meal.setUser(user);
        return mealRepo.save(meal);
    }

    // ===============================
    // ✅ GET ALL MEALS (HISTORY)
    // ===============================
    @GetMapping("/{userId}")
    public List<Meal> getMeals(@PathVariable Long userId) {
        return mealRepo.findByUserId(userId)
                .stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .toList();
    }

    // ===============================
    // ✅ BILL (CORRECT LOGIC)
    // ===============================
    @GetMapping("/bill/{userId}/{year}/{month}")
    public Map<String, Object> getBill(
            @PathVariable Long userId,
            @PathVariable int year,
            @PathVariable int month
    ) {

        Map<String, Long> stats =
                calculateStats(userId, year, month);

        long taken = stats.get("taken");
        long skipped = stats.get("skipped");
        long totalMealsTillToday = stats.get("totalMealsTillToday");

        YearMonth ym = YearMonth.of(year, month);

        long totalMeals = ym.lengthOfMonth() * 3; // 🔥 THIS IS MISSING NOW

        long total = taken * 30;

        Map<String, Object> result = new HashMap<>();
        result.put("taken", taken);
        result.put("skipped", skipped);
        result.put("totalMealsTillToday", totalMealsTillToday); // ✅ ADD
        result.put("totalMeals", totalMeals);                   // ✅ ADD
        result.put("total", total);

        return result;
    }
    // ===============================
    // ✅ CALENDAR
    // ===============================
    @GetMapping("/calendar/{userId}/{date}")
    public Map<String, String> getDayStatus(
            @PathVariable Long userId,
            @PathVariable String date
    ) {

        LocalDate localDate = LocalDate.parse(date);

        List<Meal> meals =
                mealRepo.findByUserIdAndDate(userId, localDate);

        Map<String, String> result = new HashMap<>();

        // If no meals yet
        if (meals.isEmpty()) {
            result.put("status", "NORMAL");
            return result;
        }

        boolean allSkipped = meals.size() == 3 &&
                meals.stream().allMatch(
                        m -> m.getStatus().equalsIgnoreCase("Skip")
                );

        result.put("status", allSkipped ? "RED" : "NORMAL");

        return result;
    }

    // ===============================
    // 🔥 CORE LOGIC (FIXED)
    // ===============================
    public Map<String, Long> calculateStats(Long userId, int year, int month) {

        LocalDate today = LocalDate.now();

        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);

        List<Meal> meals =
                mealRepo.findByUserIdAndDateBetween(userId, start, today);

        // Map: date-mealType → status
        Map<String, String> mealMap = new HashMap<>();

        for (Meal m : meals) {
            String key = m.getDate() + "-" + m.getMealType();
            mealMap.put(key, m.getStatus());
        }

        Map<String, Integer> deadlines = Map.of(
                "Breakfast", 9,
                "Lunch", 14,
                "Dinner", 21
        );

        int currentHour = java.time.LocalTime.now().getHour();

        long skipped = 0;
        long totalMealsTillToday = 0;

        for (int day = 1; day <= today.getDayOfMonth(); day++) {

            LocalDate date = start.withDayOfMonth(day);

            for (String meal : List.of("Breakfast", "Lunch", "Dinner")) {

                int deadline = deadlines.get(meal);
                String key = date + "-" + meal;

                // ⏳ Ignore future meals today
                if (date.equals(today) && currentHour < deadline) continue;

                totalMealsTillToday++;

                if (mealMap.containsKey(key)) {

                    if (mealMap.get(key).equalsIgnoreCase("Skip")) {
                        skipped++;
                    }

                } else {
                    // ❗ NO RECORD = SKIPPED
                    skipped++;
                }
            }
        }

        long taken = totalMealsTillToday - skipped;

        return Map.of(
                "taken", taken,
                "skipped", skipped,
                "totalMealsTillToday", totalMealsTillToday
        );
    }
}