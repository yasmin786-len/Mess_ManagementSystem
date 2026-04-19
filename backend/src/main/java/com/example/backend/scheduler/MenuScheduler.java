package com.example.backend.scheduler;

import com.example.backend.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class MenuScheduler {

    @Autowired
    private NotificationService notificationService;

    // ⏰ Runs every day at 7:00 AM
    @Scheduled(cron = "0 0 7 * * ?")
    public void sendDailyMenu() {

        String menu = "🍽️ Breakfast: Idli\n🍛 Lunch: Rice & Dal\n🥘 Dinner: Chapati";

        notificationService.sendToAll(
                "Today's Menu",
                menu
        );
    }
}