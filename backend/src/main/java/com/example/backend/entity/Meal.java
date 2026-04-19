package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate; // ✅ ADD THIS

@Entity
@Data
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mealType;
    private String status;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // ✅ this now works
}