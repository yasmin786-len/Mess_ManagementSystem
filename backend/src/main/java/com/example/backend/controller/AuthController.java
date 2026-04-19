package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ===============================
    // ✅ AUTO MESS ASSIGN (STUDENTS)
    // ===============================
    private String assignMess(String gender, String branch) {

        if (branch.equals("PUC-1") || branch.equals("PUC-2")) {
            return gender.equalsIgnoreCase("Female") ? "Mess-1" : "Mess-2";
        }

        if (branch.equals("BTECH-1") || branch.equals("BTECH-2")) {
            return gender.equalsIgnoreCase("Female") ? "Mess-3" : "Mess-4";
        }

        if (branch.equals("BTECH-3") || branch.equals("BTECH-4")) {
            return gender.equalsIgnoreCase("Female") ? "Mess-5" : "Mess-6";
        }

        return "Mess-1";
    }

    // ===============================
    // ✅ REGISTER
    // ===============================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user){

        // 🔥 BASIC VALIDATION
        if (user.getFullName() == null || user.getUserId() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }

        // 🔥 DEFAULT ROLE
        if (user.getRole() == null) {
            user.setRole("STUDENT");
        }

        String role = user.getRole().toUpperCase();

        // ===============================
        // 👨‍🎓 STUDENT LOGIC
        // ===============================
        if (role.equals("STUDENT")) {

            if (user.getEmail() == null || user.getGender() == null || user.getBranch() == null) {
                return ResponseEntity.badRequest().body("Student details missing");
            }

            // Email unique
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Auto assign mess
            String messAssigned = assignMess(user.getGender(), user.getBranch());
            user.setMessNo(messAssigned);
        }

        // ===============================
        // 👨‍🍳 STAFF LOGIC (NEW)
        // ===============================
        else if (role.equals("STAFF")) {

            if (user.getMessNo() == null || user.getMessNo().isEmpty()) {
                return ResponseEntity.badRequest().body("Mess is required for staff");
            }

            // Optional: restrict valid mess values
            if (!user.getMessNo().matches("Mess-[1-6]")) {
                return ResponseEntity.badRequest().body("Invalid mess selected");
            }
        }

        // ===============================
        // 👑 ADMIN LOGIC (OPTIONAL)
        // ===============================
        else if (role.equals("ADMIN")) {
            // You can add secret key validation later if needed
        }

        // ===============================
        // 🔥 COMMON VALIDATIONS
        // ===============================

        if (userRepository.findByUserId(user.getUserId()).isPresent()) {
            return ResponseEntity.badRequest().body("User ID already exists");
        }

        // 🔐 PASSWORD ENCODE
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 💾 SAVE
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    // ===============================
    // ✅ LOGIN
    // ===============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request){

        Optional<User> userOptional =
                userRepository.findByUserId(request.getUserId());

        if(userOptional.isEmpty()){
            return ResponseEntity.status(401).body("User not found");
        }

        User user = userOptional.get();

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            return ResponseEntity.status(401).body("Invalid password");
        }

        return ResponseEntity.ok(user);
    }
}