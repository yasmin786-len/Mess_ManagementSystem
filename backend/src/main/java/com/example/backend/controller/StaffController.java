package com.example.backend.controller;

import com.example.backend.entity.MealEntry;
import com.example.backend.service.MealEntryService;
import com.example.backend.entity.Complaint;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.service.MealService;
import com.example.backend.repository.MealEntryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:5173")
public class StaffController {

    @Autowired
    private MealEntryService mealEntryService;

    @Autowired
    private ComplaintRepository complaintRepo;

    @Autowired
    private MealEntryRepository mealEntryRepository;

    @Autowired
    private MealService mealService; // ✅ ADD THIS

    // ================= COMPLAINTS =================

    @GetMapping("/complaints/{mess}")
    public List<Complaint> getComplaints(@PathVariable String mess) {

        return complaintRepo
                .findByAssignedToAndAssignedMess("STAFF", mess)
                .stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate())) // latest first
                .toList();
    }

    @PutMapping("/complaints/resolve/{id}")
    public Complaint resolveComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        Complaint c = complaintRepo.findById(id).orElseThrow();

        c.setStatus("Resolved");
        c.setResponse(body.get("response"));

        return complaintRepo.save(c);
    }

    // ================= MEAL DASHBOARD =================

    @GetMapping("/meals/today/{messNo}")
    public Map<String, Object> getTodayMealStats(@PathVariable String messNo) {

        System.out.println("API HIT ✅");

        String meal = mealService.getCurrentMeal();

        long count = mealService.getTodayEatingCount(meal, messNo);

        double required = mealService.getFoodRequiredKg(count);

        Map<String, Object> res = new HashMap<>();
        res.put("mealType", meal);
        res.put("studentsEating", count);
        res.put("foodRequiredKg", required);

        return res;
    }

    @PostMapping("/meals/save")
    public MealEntry saveMeal(@RequestBody Map<String, Object> body) {

        String mess = (String) body.get("messNo");
        String meal = (String) body.get("mealType");

        double prepared = Double.parseDouble(body.get("preparedKg").toString());
        double leftover = Double.parseDouble(body.get("leftoverKg").toString());

        return mealEntryService.saveEntry(mess, meal, prepared, leftover);
    }

    @GetMapping("/meals/today-entry/{mess}")
    public List<MealEntry> getTodayEntries(@PathVariable String mess) {

        List<MealEntry> list = mealEntryService.getTodayEntries(mess);

        System.out.println("TODAY ENTRIES: " + list); // 🔥 ADD THIS

        return list;
    }

    @GetMapping("/meals/wastage-trend/{mess}")
    public List<Map<String, Object>> getWastageTrend(@PathVariable String mess) {

        List<MealEntry> entries = mealEntryRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();

        for (MealEntry e : entries) {

            if (e.getMessNo() != null && e.getMessNo().equalsIgnoreCase(mess)) {

                Map<String, Object> obj = new HashMap<>();

                obj.put("day", e.getDate().toString().substring(5));
                obj.put("value", e.getWastageKg());

                result.add(obj);
            }
        }

        return result;
    }
    @GetMapping("/meals/comparison/{mess}")
    public List<Map<String, Object>> getComparison(@PathVariable String mess) {
        List<MealEntry> entries = mealEntryRepository.findAll();

        Map<String, Map<String, Object>> map = new LinkedHashMap<>();

        for (MealEntry e : entries) {

            if (e.getMessNo() == null || !e.getMessNo().equalsIgnoreCase(mess)) continue;

            String date = e.getDate().toString();

            map.putIfAbsent(date, new HashMap<>());

            Map<String, Object> day = map.get(date);

            day.put("day", date);

            // initialize values
            day.putIfAbsent("b", 0.0);
            day.putIfAbsent("l", 0.0);
            day.putIfAbsent("d", 0.0);

            double wastage = e.getLeftoverKg(); // 🔥 USE THIS

            switch (e.getMealType()) {
                case "Breakfast" -> day.put("b", wastage);
                case "Lunch" -> day.put("l", wastage);
                case "Dinner" -> day.put("d", wastage);
            }

            double total =
                    (double) day.get("b") +
                            (double) day.get("l") +
                            (double) day.get("d");

            day.put("t", total);
        }

        return new ArrayList<>(map.values());
    }
    @GetMapping("/meals/today-total/{mess}")
    public Map<String, Double> getTodayTotal(@PathVariable String mess) {

        List<MealEntry> list = mealEntryRepository.findAll()
                .stream()
                .filter(e -> e.getMessNo().equalsIgnoreCase(mess))
                .toList();

        double totalPrepared = 0;
        double totalWastage = 0;

        for (MealEntry e : list) {
            totalPrepared += e.getPreparedKg();
            totalWastage += e.getLeftoverKg();
        }

        Map<String, Double> result = new HashMap<>();
        result.put("prepared", totalPrepared);
        result.put("wastage", totalWastage);

        return result;
    }
}