package com.example.backend.controller;

import com.example.backend.entity.Alert;
import com.example.backend.repository.AlertRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {

    @Autowired
    private AlertRepository alertRepo;

    // ✅ SEND ALERT (ADMIN)
    @PostMapping("/send")
    public Alert sendAlert(@RequestBody Alert alert) {
        alert.setCreatedAt(java.time.LocalDateTime.now());
        return alertRepo.save(alert);
    }

    // ✅ GET ALL ALERTS (STUDENTS)
    @GetMapping("/all")
    public List<Alert> getAllAlerts() {
        return alertRepo.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }
}