package com.example.backend.service;

import com.example.backend.entity.MealEntry;
import com.example.backend.repository.MealEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class MealEntryService {

    @Autowired
    private MealEntryRepository repo;

    public MealEntry saveEntry(String mess, String meal, double prepared, double leftover) {

        MealEntry entry = repo
                .findByMessNoAndMealTypeAndDate(mess, meal, LocalDate.now())
                .orElse(new MealEntry());

        entry.setMessNo(mess);
        entry.setMealType(meal);
        entry.setPreparedKg(prepared);
        entry.setLeftoverKg(leftover);
        entry.setWastageKg(leftover); // ✅ leftover = wastage
        entry.setDate(LocalDate.now());

        return repo.save(entry);
    }

    public MealEntry getTodayEntry(String mess, String meal) {
        return repo
                .findByMessNoAndMealTypeAndDate(mess, meal, LocalDate.now())
                .orElse(null);
    }

    public List<MealEntry> getTodayEntries(String mess) {

        return repo.findByMessNoAndDate(mess, LocalDate.now());
    }


    public Map<String, Double> getTotalForToday(String mess) {

        List<MealEntry> list = repo.findByMessNoAndDate(mess, LocalDate.now());

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