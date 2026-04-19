package com.example.backend.controller;

import com.example.backend.entity.Meal;
import com.example.backend.entity.User;
import com.example.backend.entity.Complaint;
import com.example.backend.repository.MealRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.NotificationService;
import com.example.backend.repository.ComplaintRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private MealRepository mealRepo;

    @Autowired
    private ComplaintRepository complaintRepo;

    // ===============================
    // ✅ ADMIN BILLING (FINAL)
    // ===============================
    @GetMapping("/billing")
    public List<Map<String, Object>> getBilling(
            @RequestParam int year,
            @RequestParam int month
    ) {

        List<User> users = userRepo.findByRole("STUDENT");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {

            Map<String, Long> stats =
                    calculateStats(u.getId(), year, month);

            long taken = stats.get("taken");
            long skipped = stats.get("skipped");

            long total = taken * 30;

            result.add(Map.of(
                    "name", u.getFullName(),
                    "userId", u.getUserId(),
                    "branch", u.getBranch(),
                    "taken", taken,
                    "skipped", skipped,
                    "total", total
            ));
        }

        return result;
    }

    // ===============================
    // 🔥 CORE LOGIC (MATCH DASHBOARD)
    // ===============================
    private Map<String, Long> calculateStats(Long userId, int year, int month) {

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

        Map<String, Long> stats = new HashMap<>();
        stats.put("taken", taken);
        stats.put("skipped", skipped);

        return stats;
    }

    // ===============================
    // 🔔 SEND NOTIFICATION
    // ===============================
    @PostMapping("/send-notification")
    public String sendNotification(@RequestBody Map<String, String> body) {

        String title = body.get("title");
        String message = body.get("message");

        System.out.println("TITLE: " + title);
        System.out.println("MESSAGE: " + message);

        notificationService.sendToAll(title, message);

        return "Notification sent successfully!";
    }
    @GetMapping("/analytics/monthly")
    public Map<String, Object> getMonthlyTrends(@RequestParam int year) {

        List<User> users = userRepo.findByRole("STUDENT");

        List<String> months = new ArrayList<>();
        List<Integer> skipsData = new ArrayList<>();
        List<Integer> wastageData = new ArrayList<>();

        for (int m = 1; m <= 12; m++) {

            int totalSkips = 0;

            for (User u : users) {
                Map<String, Long> stats =
                        calculateStats(u.getId(), year, m);

                totalSkips += stats.get("skipped");
            }

            int wastage = totalSkips * 1; // simple logic

            // month name (Jan, Feb...)
            YearMonth ym = YearMonth.of(year, m);
            String monthName = ym.getMonth().name().substring(0, 3);

            months.add(monthName);
            skipsData.add(totalSkips);
            wastageData.add(wastage);
        }

        return Map.of(
                "months", months,
                "skips", skipsData,
                "wastage", wastageData
        );
    }

    @PutMapping("/complaints/forward/{id}")
    public Complaint forwardToStaff(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        Complaint c = complaintRepo.findById(id).orElseThrow();

        // 🔥 GET STUDENT MESS
        String mess = c.getUser().getMessNo();

        c.setAssignedTo("STAFF");
        c.setAssignedMess(mess); // ✅ VERY IMPORTANT
        c.setStatus("Forwarded");
        c.setPriority(body.get("priority"));

        return complaintRepo.save(c);
    }
}