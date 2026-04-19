package com.example.backend.service;

import com.example.backend.entity.Notification;
import com.example.backend.entity.User;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;

    // ✅ SEND TO ALL USERS

    public void sendToAll(String title, String message) {

        List<User> users = userRepo.findAll();
        System.out.println("USERS COUNT: " + users.size()); // 👈 ADD THIS

        for (User user : users) {
            Notification n = new Notification();
            n.setTitle(title);
            n.setMessage(message);
            n.setDate(LocalDate.now());
            n.setRead(false);
            n.setUser(user);

            notificationRepo.save(n);
        }
    }

    // ✅ GET USER NOTIFICATIONS
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepo.findByUserIdOrderByDateDesc(userId);
    }

    // ✅ DELETE (PERMANENT)
    public void deleteNotification(Long id) {
        notificationRepo.deleteById(id);
    }

    // ✅ MARK AS READ
    public void markAsRead(Long id) {
        Notification notification = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepo.save(notification);
    }
}
