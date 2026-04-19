package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String userId;

    @Column(unique = true)
    private String email;

    private String password;
    private String gender;
    private String branch;
    private String messNo;

    private String role;

    public User() {}

    public User(String fullName, String userId, String email, String password, String role) {
        this.fullName = fullName;
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Long getId() { return id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getMessNo() {
        return messNo;
    }

    public void setMessNo(String messNo) {
        this.messNo = messNo;
    }

}