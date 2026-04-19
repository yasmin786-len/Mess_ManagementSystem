package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class MealEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String messNo;
    private String mealType;

    private double preparedKg;
    private double leftoverKg;
    private double wastageKg;

    private LocalDate date;

    public Long getId() { return id; }

    public String getMessNo() { return messNo; }
    public void setMessNo(String messNo) { this.messNo = messNo; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public double getPreparedKg() { return preparedKg; }
    public void setPreparedKg(double preparedKg) { this.preparedKg = preparedKg; }

    public double getLeftoverKg() { return leftoverKg; }
    public void setLeftoverKg(double leftoverKg) { this.leftoverKg = leftoverKg; }

    public double getWastageKg() { return wastageKg; }
    public void setWastageKg(double wastageKg) { this.wastageKg = wastageKg; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}