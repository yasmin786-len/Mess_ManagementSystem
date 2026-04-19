package com.example.backend.controller;

import com.example.backend.entity.Notification;
import com.example.backend.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentNotificationController {

    @Autowired
    private NotificationService notificationService;

    // ✅ GET notifications
    @GetMapping("/notifications/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    // ✅ DELETE notification (PERMANENT DELETE)
    @DeleteMapping("/notifications/{id}")
    public String deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return "Deleted Successfully";
    }

    // ✅ MARK AS READ
    @PutMapping("/notifications/read/{id}")
    public String markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return "Marked as Read";
    }
}